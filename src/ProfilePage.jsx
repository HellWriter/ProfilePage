import { useState, useEffect } from "react";

const axios = {
  get: async (url) => {
    await new Promise((r) => setTimeout(r, 600));
    return { data: mockUser };
  },
  put: async (url, data) => {
    await new Promise((r) => setTimeout(r, 800));
    return { data: { ...mockUser, ...data } };
  },
};

const mockUser = {
  id: 1,
  name: "Gilang Febrian",
  username: "@gilang",
  city: "Yogyakarta, Indonesia",
  joinDate: "Maret 2023",
  bio: "Food enthusiast & culinary explorer. Selalu mencari hidden gems kuliner lokal yang autentik. Percaya bahwa makanan terbaik ada di warung pinggir jalan.",
  avatar: "GR",
  stats: { ulasan: 29, rating: 4.7, helpful: 173 },
  ratingDist: [
    { stars: 5, count: 18, pct: 62 },
    { stars: 4, count: 8,  pct: 28 },
    { stars: 3, count: 2,  pct: 7  },
    { stars: 2, count: 1,  pct: 3  },
    { stars: 1, count: 0,  pct: 0  },
  ],
  categories: [
    { name: "Masakan Jawa", count: 9,  pct: 62 },
    { name: "Kafe & Kopi",  count: 7,  pct: 48 },
    { name: "Sate & Grill", count: 5,  pct: 34 },
    { name: "Bakmi & Mie",  count: 4,  pct: 28 },
    { name: "Lainnya",      count: 4,  pct: 28 },
  ],
};

const reviews = [
  { id: 1, restaurant: "Warung Bu Sari",     category: "Masakan Jawa",      location: "Jl. Malioboro No. 12, Yogyakarta", rating: 5, date: "2 hari lalu",   title: '"Gudeg terenak yang pernah saya coba!"',      content: "Gudegnya manis sempurna, nangkanya lembut dan meresap bumbu. Ayam kampungnya empuk banget. Pelayanan ramah dan tempatnya nyaman.", tags: ["Gudeg","Ayam Kampung","Autentik"],            helpful: 24},
  { id: 2, restaurant: "Kopi Klotok",         category: "Kafe & Kopi",       location: "Jl. Kaliurang Km 16, Sleman",      rating: 4, date: "1 minggu lalu", title: '"Suasana pinggir sawah yang bikin betah"',    content: "View sawahnya luar biasa, apalagi pas pagi hari. Kopi jossnya unik — kopi hitam dicampur arang, rasanya smoky dan bold.",        tags: ["Kopi Jos","View Sawah","Instagramable"],     helpful: 41},
  { id: 3, restaurant: "Sate Pak Mul",        category: "Sate & Grill",      location: "Jl. Parangtritis No. 88, Bantul",  rating: 5, date: "2 minggu lalu", title: '"Sate kambing juara, bumbunya meresap!"',     content: "Ukuran satenya besar-besar, dagingnya empuk dan tidak bau prengus. Bumbu kacangnya kental dan gurih. Lontongnya fresh.",          tags: ["Sate Kambing","Porsi Besar","Murah Meriah"], helpful: 18},
  { id: 4, restaurant: "Bakmi Jawa Pak Rebo", category: "Bakmi & Mie",       location: "Jl. Godean No. 5, Yogyakarta",    rating: 4, date: "1 bulan lalu",  title: '"Bakmi dimasak arang, beda banget rasanya"', content: "Proses masaknya pakai arang memberi rasa yang khas dan aroma smoky. Mie-nya kenyal, kuahnya ringan tapi berasa.",               tags: ["Bakmi Arang","Tradisional","Ramai"],          helpful: 33},
  { id: 5, restaurant: "Es Dawet Ibu Hamid",  category: "Minuman & Dessert", location: "Pasar Beringharjo, Yogyakarta",    rating: 5, date: "1 bulan lalu",  title: '"Dawet paling segar se-Malioboro!"',          content: "Santan segar, gula jawa asli, cendol hijau yang kenyal. Disajikan dengan es batu serut. Harganya sangat murah untuk kualitas yang luar biasa.", tags: ["Es Dawet","Segar","Legendaris"], helpful: 57},
];

const wishlist = [
  { icon: "🏡", name: "Jejamuran Restaurant" },
  { icon: "👑", name: "Bale Raos Keraton" },
  { icon: "🌿", name: "Mediterania Cafe" },
  { icon: "☕", name: "Warung Kopi Klotok 2" },
  { icon: "🍲", name: "Soto Pak Min Klaten" },
  { icon: "🍚", name: "Nasi Liwet Bu Wongso" },
  { icon: "🐟", name: "Mangut Lele Mbah Marto" },
  { icon: "🍗", name: "Ayam Goreng Suharti" },
];

const monoColors = ["#212529", "#495057", "#868e96", "#ced4da", "#dee2e6"];

function StarRating({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#212529" : "#dee2e6" }}>★</span>
      ))}
    </span>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x mb-4 d-flex align-items-center gap-2 text-white rounded-pill px-4 py-2 shadow"
      style={{ background: "#212529", zIndex: 1060, fontSize: "0.85rem" }}
    >
      <span style={{ color: "#69db7c" }}>✓</span>
      {message}
    </div>
  );
}

function EditProfileModal({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name:     user.name,
    username: user.username,
    city:     user.city,
    bio:      user.bio,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const initials = form.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{ width: "100%", maxWidth: 500 }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <div>
            <h6 className="mb-0 fw-semibold" style={{ color: "#212529" }}>Edit Profil</h6>
            <small className="text-secondary">Perbarui informasi akun Anda</small>
          </div>
          <button
            onClick={onCancel}
            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
          >✕</button>
        </div>

        <div className="d-flex align-items-center gap-3 px-4 pt-4 pb-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
            style={{ width: 56, height: 56, background: "#212529", fontSize: "1.1rem" }}
          >
            {initials}
          </div>
          <div>
            <p className="mb-0 fw-semibold small" style={{ color: "#212529" }}>{form.name}</p>
            <button className="btn btn-link btn-sm p-0 text-secondary text-decoration-underline" style={{ fontSize: "0.75rem" }}>
              Ganti foto profil
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label text-uppercase fw-semibold" style={{ fontSize: "0.65rem", color: "#868e96", letterSpacing: "0.08em" }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                className="form-control form-control-sm bg-light border"
                value={form.name}
                onChange={set("name")}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="col-6">
              <label className="form-label text-uppercase fw-semibold" style={{ fontSize: "0.65rem", color: "#868e96", letterSpacing: "0.08em" }}>
                Username
              </label>
              <input
                type="text"
                className="form-control form-control-sm bg-light border"
                value={form.username}
                onChange={set("username")}
                placeholder="@username"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-uppercase fw-semibold" style={{ fontSize: "0.65rem", color: "#868e96", letterSpacing: "0.08em" }}>
              Kota
            </label>
            <input
              type="text"
              className="form-control form-control-sm bg-light border"
              value={form.city}
              onChange={set("city")}
              placeholder="Kota, Negara"
            />
          </div>
          <div>
            <label className="form-label text-uppercase fw-semibold" style={{ fontSize: "0.65rem", color: "#868e96", letterSpacing: "0.08em" }}>
              Bio
            </label>
            <textarea
              className="form-control form-control-sm bg-light border"
              value={form.bio}
              onChange={set("bio")}
              rows={3}
              maxLength={200}
              placeholder="Ceritakan sedikit tentang dirimu..."
              style={{ resize: "none" }}
            />
            <div className="text-end mt-1" style={{ fontSize: "0.7rem", color: "#ced4da" }}>{form.bio.length}/200 karakter</div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between px-4 pb-4">
          <small className="text-secondary">Perubahan akan disimpan ke server</small>
          <div className="d-flex gap-2">
            <button onClick={onCancel} className="btn btn-sm btn-outline-secondary">Batal</button>
            <button
              onClick={() => onSave(form)}
              disabled={loading}
              className="btn btn-sm d-flex align-items-center gap-2"
              style={{ background: "#212529", color: "#fff" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  Menyimpan...
                </>
              ) : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [liked, setLiked] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);

  const toggleLike = () => {
    setLiked((prev) => {
      setHelpfulCount((c) => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  return (
    <div className="card border rounded-3 mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div>
            <span className="fw-semibold me-2" style={{ color: "#212529" }}>{review.restaurant}</span>
            <span className="badge rounded-pill border" style={{ background: "#f8f9fa", color: "#868e96", fontWeight: 400, fontSize: "0.7rem" }}>
              {review.category}
            </span>
            <div className="text-secondary mt-1" style={{ fontSize: "0.75rem" }}>📍 {review.location}</div>
          </div>
          <div className="text-end flex-shrink-0">
            <StarRating rating={review.rating} />
            <div className="text-secondary mt-1" style={{ fontSize: "0.7rem" }}>{review.date}</div>
          </div>
        </div>

        <p className="fw-semibold fst-italic mb-1" style={{ color: "#495057", fontSize: "0.875rem" }}>{review.title}</p>
        <p className="text-secondary mb-2" style={{ fontSize: "0.8rem", lineHeight: 1.65 }}>{review.content}</p>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {review.tags.map((tag) => (
            <span key={tag} className="badge border rounded-pill" style={{ background: "#f8f9fa", color: "#495057", fontWeight: 400, fontSize: "0.7rem" }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3 pt-2 border-top" style={{ fontSize: "0.75rem", color: "#868e96" }}>
          <button
            onClick={toggleLike}
            className="btn btn-sm rounded-pill px-3"
            style={liked
              ? { background: "#212529", color: "#fff", border: "1px solid #212529", fontSize: "0.75rem" }
              : { background: "transparent", color: "#868e96", border: "1px solid #dee2e6", fontSize: "0.75rem" }
            }
          >
            👍 {helpfulCount} Helpful
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("ulasan");
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    axios.get("/api/user/1").then((res) => {
      setUser(res.data);
      setLoadingUser(false);
    });
  }, []);

  const handleSave = async (form) => {
    setSavingEdit(true);
    try {
      const res = await axios.put("/api/user/1", form);
      setUser((u) => ({ ...u, ...res.data }));
      setEditOpen(false);
      setToast("Profil berhasil diperbarui!");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredReviews =
    ratingFilter === 0 ? reviews : reviews.filter((r) => r.rating === ratingFilter);

  if (loadingUser) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="spinner-border mb-3" style={{ color: "#212529" }} />
        <p className="text-secondary small">Memuat profil...</p>
      </div>
    );
  }

  const avatarInitials = user.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-vh-100 bg-light">

      <nav className="navbar sticky-top" style={{ background: "#212529" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <span className="navbar-brand mb-0 fw-bold text-white" style={{ letterSpacing: "-0.3px" }}>
            Kompas<span style={{ color: "#868e96" }}>Jajan</span>
          </span>
          <div className="d-flex align-items-center gap-4">
            <a href="#" className="text-decoration-none small" style={{ color: "#868e96" }}>Jelajahi</a>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 34, height: 34, background: "#495057", color: "#dee2e6", fontSize: "0.75rem", cursor: "pointer" }}
            >
              {avatarInitials}
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 960 }}>

        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <div style={{ height: 110, background: "linear-gradient(135deg, #343a40, #212529)" }} />
          <div className="card-body pt-0">
            <div className="d-flex align-items-end justify-content-between" style={{ marginTop: -44 }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow"
                style={{ width: 80, height: 80, background: "#212529", border: "4px solid #fff", fontSize: "1.5rem", flexShrink: 0 }}
              >
                {avatarInitials}
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 mb-1"
              >
                ✏️ Edit Profil
              </button>
            </div>

            <div className="mt-3">
              <div className="d-flex align-items-baseline gap-2">
                <h5 className="mb-0 fw-bold" style={{ color: "#212529" }}>{user.name}</h5>
                <span className="text-secondary small">{user.username}</span>
              </div>
              <div className="d-flex gap-3 mt-1 flex-wrap">
                <small className="text-secondary">📍 {user.city}</small>
                <small className="text-secondary">📅 Bergabung {user.joinDate}</small>
              </div>
              <p className="text-secondary mt-2 mb-0" style={{ fontSize: "0.875rem", lineHeight: 1.65, maxWidth: 520 }}>{user.bio}</p>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: "Ulasan",  value: user.stats.ulasan,  icon: "📝" },
            { label: "Rating",  value: user.stats.rating,  icon: "⭐" },
            { label: "Helpful", value: user.stats.helpful, icon: "👍" },
          ].map((s) => (
            <div key={s.label} className="col-4">
              <div className="card border shadow-sm text-center h-100">
                <div className="card-body py-3">
                  <div style={{ fontSize: "1.25rem" }}>{s.icon}</div>
                  <div className="fw-bold mt-1" style={{ fontSize: "1.4rem", color: "#212529" }}>{s.value}</div>
                  <div className="text-uppercase text-secondary mt-1" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">

          <div className="col-12 col-lg-4">

            <div className="card border shadow-sm rounded-3 mb-3">
              <div className="card-body">
                <h6 className="text-uppercase text-secondary fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  <span className="rounded-pill d-inline-block" style={{ width: 3, height: 14, background: "#212529" }} />
                  Distribusi Rating
                </h6>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fw-bold" style={{ fontSize: "2.2rem", color: "#212529", letterSpacing: "-2px" }}>{user.stats.rating}</span>
                  <div>
                    <div style={{ color: "#212529", letterSpacing: "2px" }}>★★★★★</div>
                    <small className="text-secondary">{user.stats.ulasan} ulasan total</small>
                  </div>
                </div>
                {user.ratingDist.map((r, i) => (
                  <div key={r.stars} className="d-flex align-items-center gap-2 mb-1">
                    <small className="text-secondary" style={{ width: 10 }}>{r.stars}</small>
                    <small className="text-secondary">★</small>
                    <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: 6, background: "#f1f3f5" }}>
                      <div className="h-100 rounded-pill" style={{ width: `${r.pct}%`, background: monoColors[i] }} />
                    </div>
                    <small className="text-secondary text-end" style={{ width: 16 }}>{r.count}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border shadow-sm rounded-3">
              <div className="card-body">
                <h6 className="text-uppercase text-secondary fw-semibold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  <span className="rounded-pill d-inline-block" style={{ width: 3, height: 14, background: "#212529" }} />
                  Kategori Favorit
                </h6>
                {user.categories.map((c, i) => (
                  <div key={c.name} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small style={{ color: "#495057" }}>{c.name}</small>
                      <small className="text-secondary">{c.count}</small>
                    </div>
                    <div className="rounded-pill overflow-hidden" style={{ height: 4, background: "#f1f3f5" }}>
                      <div className="h-100 rounded-pill" style={{ width: `${c.pct}%`, background: monoColors[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">

            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div className="btn-group btn-group-sm" role="group">
                {[
                  { key: "ulasan",   label: `Ulasan (${reviews.length})` },
                  { key: "wishlist", label: `Wishlist (${wishlist.length})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`btn btn-sm ${activeTab === tab.key ? "" : "btn-outline-secondary"}`}
                    style={activeTab === tab.key
                      ? { background: "#212529", color: "#fff", border: "1px solid #212529", fontSize: "0.8rem" }
                      : { fontSize: "0.8rem" }
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "ulasan" && (
                <select
                  className="form-select form-select-sm w-auto"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  style={{ fontSize: "0.8rem" }}
                >
                  <option value={0}>Semua Rating</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>★ {r} Bintang</option>
                  ))}
                </select>
              )}
            </div>

            {activeTab === "ulasan" && (
              <>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((r) => <ReviewCard key={r.id} review={r} />)
                ) : (
                  <div className="card border text-center py-5">
                    <p className="display-6 mb-2">🔍</p>
                    <p className="text-secondary small">Tidak ada ulasan untuk filter ini.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "wishlist" && (
              <div className="d-flex flex-column gap-2">
                {wishlist.map((w) => (
                  <div key={w.name} className="card border shadow-sm rounded-3">
                    <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 36, height: 36, background: "#f1f3f5", fontSize: "1.1rem" }}
                        >
                          {w.icon}
                        </div>
                        <span className="fw-medium small" style={{ color: "#212529" }}>{w.name}</span>
                      </div>
                      <span className="badge border rounded-pill" style={{ background: "#f8f9fa", color: "#868e96", fontWeight: 400, fontSize: "0.7rem" }}>
                        Belum dikunjungi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center py-4 mt-2" style={{ fontSize: "0.75rem", color: "#ced4da" }}>
        KompasJajan © 2025 · Temukan, Nikmati, Bagikan
      </footer>

      {editOpen && (
        <EditProfileModal
          user={user}
          onSave={handleSave}
          onCancel={() => setEditOpen(false)}
          loading={savingEdit}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
