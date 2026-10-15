const labels={
 fa:{DRAFT:'پیش‌نویس',PUBLISHED:'منتشرشده',SELECTED:'پیشنهاد پذیرفته‌شده',ASSIGNED:'تخصیص‌یافته',PICKUP:'بارگیری',IN_TRANSIT:'در مسیر',BORDER_CUSTOMS:'مرز و گمرک',DELIVERED:'تحویل‌شده',COMPLETED:'تکمیل‌شده',CANCELLED:'لغوشده'},
 tr:{DRAFT:'Taslak',PUBLISHED:'Yayında',SELECTED:'Teklif kabul edildi',ASSIGNED:'Atandı',PICKUP:'Yükleme',IN_TRANSIT:'Yolda',BORDER_CUSTOMS:'Sınır ve gümrük',DELIVERED:'Teslim edildi',COMPLETED:'Tamamlandı',CANCELLED:'İptal edildi'},
 en:{DRAFT:'Draft',PUBLISHED:'Published',SELECTED:'Offer accepted',ASSIGNED:'Assigned',PICKUP:'Loading',IN_TRANSIT:'In transit',BORDER_CUSTOMS:'Border and customs',DELIVERED:'Delivered',COMPLETED:'Completed',CANCELLED:'Cancelled'}
};
export const transportStatusLabel=(status,lang='en')=>(labels[lang]||labels.en)[status]||String(status||'—');
