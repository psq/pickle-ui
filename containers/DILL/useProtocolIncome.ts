import { useState, useEffect } from "react";
import fetch from "node-fetch";
import { getAssetPerformanceData } from "../../util/api.js";

type Jar = {
  apy: number;
  identifier: string;
  liquidity_locked: number;
};

export function useProtocolIncome() {
  const [weeklyProfit, setWeeklyProfit] = useState<number | null>(null);
  const [weeklyDistribution, setWeeklyDistribution] = useState<number | null>(
    null,
  );

  const getWeeklyIncome = async () => {
    const jarList = await fetch(
      "https://stkpowy01i.execute-api.us-west-1.amazonaws.com/prod/protocol/pools",
    ).then<Jar[]>((response) => response.json());

    const profit = jarList.reduce((acc, currJar) => {
      const jarTVL = currJar.liquidity_locked;
      return +currJar.jarApy > 0
        ? acc + (jarTVL * currJar.jarApy * 0.01 * 0.2) / 52
        : acc;
    }, 0);

    const weeklyDistribution = profit * 0.45;

    setWeeklyProfit(profit);
    setWeeklyDistribution(weeklyDistribution);
  };

  useEffect(() => {
    getWeeklyIncome();
  }, []);

  return {
    weeklyProfit,
    weeklyDistribution,
  };
}
