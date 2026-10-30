/** Fixed Unsplash originals. License and provenance: public/IMAGE_CREDITS.md. */
export const images = {
  interior: 'photo-1517248135467-4c7edcad34c4',
  table: 'photo-1414235077428-338989a2e8c0',
  room: 'photo-1552566626-52f8b828add9',
  steak: 'photo-1694345598429-00511c301452',
  salmon: 'photo-1467003909585-2f8a72700288',
  tartare: 'photo-1610315266904-28edc705ff89',
  cheese: 'photo-1743193144224-d2db90ea7784',
  pate: 'photo-1644675352812-acfc1be33302',
  duck: 'photo-1642231877874-ce3e205f39c0',
  dessert: 'photo-1488477181946-6428a0291777',
  brulee: 'photo-1615235739538-95040f341ba8',
  salad: 'photo-1512621776951-a57141f2eefd',
  soup: 'photo-1768295982465-ffc2f48e63f4',
  bread: 'photo-1509440159596-0249088772ff',
  wine: 'photo-1510812431401-41d2bd2722f3',
  coffee: 'photo-1509042239860-f550ce710b93',
  chocolate: 'photo-1578985545062-69928b1d9587',
} as const

export function imageUrl(id: string, width = 1000) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}
