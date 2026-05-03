import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).populate('owner', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name');
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      sizes: sizes ? JSON.parse(sizes) : ['S', 'M', 'L', 'XL'],
      image,
      owner: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Tidak memiliki akses' });
    }

    const { name, description, price, category, sizes } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        category,
        sizes: sizes ? JSON.parse(sizes) : product.sizes,
        image,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Tidak memiliki akses' });
    }

    await product.deleteOne();
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
