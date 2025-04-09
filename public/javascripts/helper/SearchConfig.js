async function search(list, {
    keyword = '',
    sortBy = 'id',
    lastID = '',
    orderBy = 'asc'
}){
    const limit = 15;
    const filter = list.filter(object => {
        return Object.values(object)
            .some(value => {
                // Pastikan value dan keyword diubah menjadi string dan dalam format yang cocok
                const valueString = value.toString().toLowerCase();
                // Cek apakah keyword adalah angka, jika ya, konversikan ke angka dan lakukan perbandingan numerik
                if (!isNaN(keyword)) {
                    return parseFloat(value).toString().includes(keyword);
                }
                // Jika keyword adalah string, lakukan pencocokan string biasa
                return valueString.includes(keyword.toLowerCase());
            });
    });
    // melakukan sorting
    const sort = filter.sort((a, b) => {
        if (orderBy === 'asc') {
            return a[sortBy].toString().localeCompare(b[sortBy].toString());
        }else {
            return b[sortBy].toString().localeCompare(a[sortBy].toString());
        }
    });

    const startIndex = sort.findIndex(object => object.ID === lastID) + 1;
    return sort.splice(startIndex, startIndex + limit);
}

module.exports = {search}

