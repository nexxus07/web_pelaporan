// TANDA: GraphQL filter resolver
pelaporans: async (_, { filter }) => {
    if (!filter) return Pelaporan.find().sort({ createdAt: -1 });
    const regex = new RegExp(filter, "i");
    return Pelaporan.find({
        $or: [
            { judul: regex },
            { jenis: regex },
            { laporan: regex },
            { provinsi: regex },
            { kabupaten: regex },
            { kecamatan: regex },
            { tujuan: regex },
            { kategori: regex },
            { status: regex }
        ]
    }).sort({ createdAt: -1 });
}