export const money=v=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(Number(v)||0);
export const dateTime=v=>new Intl.DateTimeFormat('en-NG',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v));
