export type KPIEntry = {
    month: string; // YYYY-MM-01
    revenue: number;
    cost: number;
  };
  
  export function calcProfit(revenue: number, cost: number) {
    return revenue - cost;
  }
  
  export function calcRoiPercent(totalInvestment: number, valueDelivered: number) {
    if (totalInvestment <= 0) return 0;
    return ((valueDelivered - totalInvestment) / totalInvestment) * 100;
  }
  
  export function calcNetSavings(totalInvestment: number, valueDelivered: number) {
    return valueDelivered - totalInvestment;
  }
  
  export function calcMoMGrowthPercent(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
  
  export type ROIInputs = {
    totalInvestment: number;
    valueDelivered: number;
    termMonths: number;
    upfrontPayment: number;
    outcomeBasedPayment: number;
  };