export const TOTAL_EMPRESAS = 4;

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const calcSimples = (faturamento, tipo) => {
  const aliquotas = { Comercio: 0.08, Servicos: 0.12, Industria: 0.10 };
  const aliq = aliquotas[tipo] ?? 0.1;
  return faturamento * aliq;
};

export const calcLucroPresumido = (faturamento, tipo) => {
  const basePercent = tipo === 'Servicos' ? 0.32 : 0.08;
  const base = faturamento * basePercent;
  const irpj = base * 0.15;
  const csll = base * 0.09;
  const pisCofins = faturamento * 0.0365;
  return irpj + csll + pisCofins;
};

export const calcLucroReal = (faturamento, lucroPercentInformado) => {
  const lucro = faturamento * (lucroPercentInformado / 100);
  const irpj = lucro * 0.15;
  const adicional = lucro > 240000 ? (lucro - 240000) * 0.1 : 0;
  const csll = lucro * 0.09;
  const pisCofins = faturamento * 0.0925;
  return irpj + adicional + csll + pisCofins;
};