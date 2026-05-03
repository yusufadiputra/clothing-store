import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProductFormPage.css';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          sizes: data.sizes,
        });
        if (data.image) {
          const baseUrl = process.env.REACT_APP_API_URL
           ? process.env.REACT_APP_API_URL.replace('/api', '')
           : 'http://localhost:5000';
          setPreview(
           data.image.startsWith('http') ? data.image : `${baseUrl}${data.image}`
          );
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSize = (s) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter((x) => x !== s)
        : [...prev.sizes, s],
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('sizes', JSON.stringify(form.sizes));
      if (image) fd.append('image', image);

      if (isEdit) {
        await api.put(`/products/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate(isEdit ? `/products/${id}` : '/my-products');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div className="section-title">
        <h2>
          {isEdit ? 'Edit' : 'Tambah'} <span>Produk</span>
        </h2>
      </div>
      <p className="section-subtitle">
        {isEdit ? 'Perbarui informasi produk.' : 'Tambahkan produk baru ke katalog.'}
      </p>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form-grid">
          <div className="product-form-fields">
            <div className="form-group">
              <label>Nama Produk</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Men Slim Fit Denim Jacket"
              />
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Deskripsi produk..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Harga ($)</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Ukuran Tersedia</label>
              <div className="size-checkboxes">
                {SIZES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`size-check-btn ${form.sizes.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="product-form-image">
            <label className="image-upload-label">
              {preview ? (
                <img src={preview} alt="preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <p>Klik untuk upload gambar</p>
                  <span>JPG, PNG, WEBP (maks. 5MB)</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {error && <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
          <button type="button" className="btn-outline" onClick={() => navigate(-1)}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
