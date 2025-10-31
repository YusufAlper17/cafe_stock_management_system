const cron = require('node-cron');
const db = require('../models');
const Sale = db.Sale;
const Product = db.Product;
const Archive = db.Archive;
const { Op } = require('sequelize');

// Her ayın ilk günü saat 00:01'de çalışacak
const scheduleMonthlyArchive = () => {
  cron.schedule(
    '1 0 1 * *',
    async () => {
      try {
        // Geçen ayın başlangıç ve bitiş tarihlerini hesapla
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startDate = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

        // Geçen ayın satışlarını getir
        const sales = await Sale.findAll({
          where: {
            date: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [
            {
              model: Product,
              attributes: ['product_name', 'cost_price']
            }
          ],
          order: [['date', 'ASC']]
        });

        // Günlük satışları grupla
        const dailySales = sales.reduce((acc, sale) => {
          const date = sale.date.toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              date,
              sales: 0,
              revenue: 0
            };
          }
          acc[date].sales += sale.quantity;
          acc[date].revenue += sale.sale_price * sale.quantity;
          return acc;
        }, {});

        // Toplam değerleri hesapla
        const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalRevenue = sales.reduce(
          (sum, sale) => sum + sale.sale_price * sale.quantity,
          0
        );

        // Arşiv oluştur
        await Archive.create({
          period: `${lastMonth.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}`,
          total_sales: totalSales,
          total_revenue: totalRevenue,
          data: {
            daily_sales: Object.values(dailySales),
            start_date: startDate,
            end_date: endDate
          }
        });

        console.log(
          `${lastMonth.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })} arşivi oluşturuldu`
        );
      } catch (error) {
        console.error('Aylık arşiv oluşturulurken hata:', error);
      }
    },
    {
      timezone: 'Europe/Istanbul'
    }
  );
};

module.exports = {
  scheduleMonthlyArchive
};
