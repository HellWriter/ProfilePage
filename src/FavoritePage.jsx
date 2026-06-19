import { useState, useEffect } from "react";

function StarRating({ rating }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#212529" : "#dee2e6" }}>★</span>
      ))}
    </span>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  const bgColor = type === "success" ? "#212529" : type === "error" ? "#495057" : "#868e96";
  const textColor = type === "warning" ? "#000" : "#fff";

  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x mb-4 d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow"
      style={{ background: bgColor, color: textColor, zIndex: 1060, fontSize: "0.85rem" }}
    >
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "⚠"}</span>
      {message}
    </div>
  );
}

function NotesModal({ restaurant, onSave, onCancel }) {
  const [notes, setNotes] = useState(restaurant.notes || "");

  const handleSave = () => {
    onSave(restaurant.id, notes);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{ width: "100%", maxWidth: 500 }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <div>
            <h6 className="mb-0 fw-semibold" style={{ color: "#212529" }}>Catatan Pribadi</h6>
            <small className="text-secondary">{restaurant.name}</small>
          </div>
          <button
            onClick={onCancel}
            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
          >✕</button>
        </div>

        <div className="px-4 py-3">
          <textarea
            className="form-control bg-light border"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={200}
            placeholder="Tambahkan catatan pribadi tentang restoran ini..."
            style={{ resize: "none" }}
          />
          <div className="text-end mt-1" style={{ fontSize: "0.7rem", color: "#ced4da" }}>{notes.length}/200 karakter</div>
        </div>

        <div className="d-flex gap-2 px-4 pb-4">
          <button onClick={onCancel} className="btn btn-sm btn-outline-secondary flex-grow-1">Batal</button>
          <button
            onClick={handleSave}
            className="btn btn-sm flex-grow-1"
            style={{ background: "#212529", color: "#fff" }}
          >
            Simpan Catatan
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuModal({ restaurant, onClose }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-4 shadow-lg overflow-hidden" style={{ width: "100%", maxWidth: 500 }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
          <div>
            <h6 className="mb-0 fw-semibold" style={{ color: "#212529" }}>Menu Favorit</h6>
            <small className="text-secondary">{restaurant.name}</small>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
          >✕</button>
        </div>

        <div className="px-4 py-3" style={{ maxHeight: 400, overflowY: "auto" }}>
          <div className="d-flex flex-column gap-2">
            {restaurant.popularMenus.map((menu) => (
              <div
                key={menu}
                className="d-flex align-items-center gap-2 p-2 rounded-2"
                style={{ background: "#f8f9fa" }}
              >
                <span style={{ fontSize: "1.1rem" }}>🍽️</span>
                <span style={{ color: "#212529", fontSize: "0.9rem" }}>{menu}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FavoriteCard({ restaurant, onRemove, onUpdateNotes, onUpdateVisited }) {
  const [removed, setRemoved] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const handleRemove = () => {
    setRemoved(true);
    setTimeout(() => onRemove(restaurant.id), 300);
  };

  const handleNotesSave = (id, notes) => {
    onUpdateNotes(id, notes);
    setNotesModalOpen(false);
  };

  const statusBarColor = restaurant.visited ? "#212529" : "#868e96";
  const statusText = restaurant.visited ? "Sudah Dikunjungi" : "Belum Dikunjungi";

  return (
    <>
      <div
        className="card border rounded-3 mb-3 shadow-sm overflow-hidden"
        style={{
          opacity: removed ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="h-2"
          style={{
            height: 4,
            background: statusBarColor,
          }}
        />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 48, height: 48, background: "#f1f3f5", fontSize: "1.4rem" }}
              >
                {restaurant.icon}
              </div>
              <div>
                <span className="fw-semibold d-block" style={{ color: "#212529" }}>
                  {restaurant.name}
                </span>
                <span
                  className="badge rounded-pill border me-2"
                  style={{ background: "#f8f9fa", color: "#868e96", fontWeight: 400, fontSize: "0.7rem" }}
                >
                  {restaurant.category}
                </span>
                <small className="text-secondary d-block mt-1">📍 {restaurant.location}</small>
              </div>
            </div>
            <div className="text-end flex-shrink-0">
              <div className="d-flex align-items-center gap-1 justify-content-end mb-1">
                <StarRating rating={restaurant.rating} />
                <span className="fw-semibold" style={{ color: "#212529", fontSize: "0.9rem" }}>
                  {restaurant.rating}
                </span>
              </div>
              <small className="text-secondary d-block">{restaurant.reviewCount} ulasan</small>
              <small className="text-secondary d-block">{restaurant.priceRange}</small>
            </div>
          </div>

          <p className="text-secondary mb-3" style={{ fontSize: "0.875rem", lineHeight: 1.65 }}>
            {restaurant.description}
          </p>

          <div className="d-flex flex-wrap gap-1 mb-3">
            {restaurant.tags.map((tag) => (
              <span
                key={tag}
                className="badge border rounded-pill"
                style={{ background: "#f8f9fa", color: "#495057", fontWeight: 400, fontSize: "0.7rem" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {restaurant.notes && (
            <div className="p-2 mb-3 rounded-2" style={{ background: "#f1f3f5", borderLeft: "3px solid #495057" }}>
              <small style={{ color: "#212529", fontStyle: "italic" }}>📝 {restaurant.notes}</small>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between pt-2 border-top flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <small className="text-secondary">{statusText}</small>
              <button
                onClick={() => onUpdateVisited(restaurant.id, !restaurant.visited)}
                className="btn btn-xs rounded-pill px-2 py-1"
                style={{
                  fontSize: "0.7rem",
                  background: statusBarColor,
                  color: restaurant.visited ? "#fff" : "#000",
                  border: "none",
                }}
              >
                {restaurant.visited ? "✓ Dikunjungi" : "○ Belum Dikunjungi"}
              </button>
            </div>

            <div className="d-flex gap-1 flex-wrap">
              <button
                onClick={() => setMenuModalOpen(true)}
                className="btn btn-sm"
                style={{
                  background: "#f1f3f5",
                  color: "#212529",
                  border: "1px solid #dee2e6",
                  fontSize: "0.75rem",
                }}
              >
                🍽️ Menu
              </button>
              <button
                onClick={() => setNotesModalOpen(true)}
                className="btn btn-sm"
                style={{
                  background: "#f1f3f5",
                  color: "#212529",
                  border: "1px solid #dee2e6",
                  fontSize: "0.75rem",
                }}
              >
                📝 Catatan
              </button>
              <button
                onClick={handleRemove}
                className="btn btn-sm"
                style={{
                  background: "#f1f3f5",
                  color: "#495057",
                  border: "1px solid #dee2e6",
                  fontSize: "0.75rem",
                }}
              >
                ✕ Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      {notesModalOpen && (
        <NotesModal
          restaurant={restaurant}
          onSave={handleNotesSave}
          onCancel={() => setNotesModalOpen(false)}
        />
      )}

      {menuModalOpen && (
        <MenuModal
          restaurant={restaurant}
          onClose={() => setMenuModalOpen(false)}
        />
      )}
    </>
  );
}

export default function FavoritePage({ 
  favorites, 
  onRemove, 
  onUpdateNotes, 
  onUpdateVisited,
  onNavigateToProfile 
}) {
  const [sortBy, setSortBy] = useState("rating");
  const [filterCategory, setFilterCategory] = useState("semua");
  const [toast, setToast] = useState(null);

  const categories = [
    "semua",
    ...new Set(favorites.map((r) => r.category)),
  ];

  const filteredFavorites = favorites
    .filter((f) =>
      filterCategory === "semua" || f.category === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleRemove = (id) => {
    const restaurant = favorites.find((f) => f.id === id);
    onRemove(id);
    setToast({
      message: `${restaurant?.name} dihapus dari favorit`,
      type: "success",
    });
  };

  const handleUpdateNotes = (id, notes) => {
    onUpdateNotes(id, notes);
    setToast({
      message: "Catatan berhasil disimpan!",
      type: "success",
    });
  };

  const handleUpdateVisited = (id, visited) => {
    onUpdateVisited(id, visited);
    const restaurant = favorites.find((f) => f.id === id);
    setToast({
      message: visited
        ? `${restaurant?.name} ditandai sudah dikunjungi`
        : `${restaurant?.name} ditandai belum dikunjungi`,
      type: "success",
    });
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar sticky-top" style={{ background: "#212529" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <span className="navbar-brand mb-0 fw-bold text-white" style={{ letterSpacing: "-0.3px" }}>
            Kompas<span style={{ color: "#868e96" }}>Jajan</span>
          </span>
          <div className="d-flex align-items-center gap-4">
            <button
              onClick={onNavigateToProfile}
              className="bg-transparent border-0 text-decoration-none small"
              style={{ color: "#868e96", cursor: "pointer" }}
            >
               Kembali ke Profil
            </button>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: 34,
                height: 34,
                background: "#495057",
                color: "#dee2e6",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              GF
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 960 }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-1" style={{ color: "#212529" }}>
            ❤️ Restoran Favorit Saya
          </h4>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Koleksi {filteredFavorites.length} restoran pilihan yang sudah saya coba dan rekomendasikan
          </p>
        </div>

        <div className="card border shadow-sm rounded-3 mb-4 p-3">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-6">
              <label className="form-label text-uppercase text-secondary fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                Filter Kategori
              </label>
              <select
                className="form-select form-select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-uppercase text-secondary fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                Urutkan Berdasarkan
              </label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="name">Nama (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredFavorites.length > 0 ? (
          <div>
            {filteredFavorites.map((restaurant) => (
              <FavoriteCard
                key={restaurant.id}
                restaurant={restaurant}
                onRemove={handleRemove}
                onUpdateNotes={handleUpdateNotes}
                onUpdateVisited={handleUpdateVisited}
              />
            ))}
          </div>
        ) : (
          <div className="card border text-center py-5">
            <p className="display-5 mb-2">💔</p>
            <p className="fw-semibold" style={{ color: "#212529" }}>
              Belum ada restoran favorit
            </p>
            <p className="text-secondary small">
              Tambahkan restoran ke favorit untuk melihatnya di sini
            </p>
          </div>
        )}
      </div>

      <footer className="text-center py-4 mt-4" style={{ fontSize: "0.75rem", color: "#ced4da" }}>
        KompasJajan © 2025 · Temukan, Nikmati, Bagikan
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
