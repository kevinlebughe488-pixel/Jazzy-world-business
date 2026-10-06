export function formatUSD(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} $`;
}

export function formatFC(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} FC`;
}
