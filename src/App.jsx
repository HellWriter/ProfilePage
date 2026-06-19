import { useState } from 'react'
import ProfilePage from './ProfilePage'
import FavoritePage from './FavoritePage'
import './App.css'

const initialFavorites = [
  {
    id: 1,
    name: "Warung Bu Sari",
    category: "Masakan Jawa",
    location: "Jl. Malioboro No. 12, Yogyakarta",
    rating: 4.8,
    reviewCount: 312,
    priceRange: "Rp 15k–40k",
    tags: ["Gudeg", "Ayam Kampung", "Autentik"],
    icon: "🏡",
    description: "Warung legendaris dengan gudeg yang sempurna dan ayam kampung yang empuk. Tempat terbaik untuk sarapan pagi autentik Yogyakarta.",
    lastVisited: "2 hari lalu",
    visited: true,
    notes: "Gudegnya enak banget! Harus coba di pagi hari.",
    popularMenus: ["Gudeg Lengkap", "Ayam Goreng", "Perkedel", "Sambal Goreng"],
  },
  {
    id: 2,
    name: "Kopi Klotok",
    category: "Kafe & Kopi",
    location: "Jl. Kaliurang Km 16, Sleman",
    rating: 4.6,
    reviewCount: 874,
    priceRange: "Rp 10k–35k",
    tags: ["Kopi Jos", "View Sawah", "Instagramable"],
    icon: "☕",
    description: "Kafe pinggir sawah dengan suasana yang menenangkan. Kopi jos mereka yang unik dengan arang membuat pengalaman yang tak terlupakan.",
    lastVisited: "1 minggu lalu",
    visited: true,
    notes: "Suasana bagus, kopi jos-nya unik dengan arang!",
    popularMenus: ["Kopi Jos", "Nasi Kuning", "Lumpia", "Jus Alpukat"],
  },
  {
    id: 3,
    name: "Sate Pak Mul",
    category: "Sate & Grill",
    location: "Jl. Parangtritis No. 88, Bantul",
    rating: 4.9,
    reviewCount: 589,
    priceRange: "Rp 30k–60k",
    tags: ["Sate Kambing", "Porsi Besar", "Murah Meriah"],
    icon: "🔥",
    description: "Sate kambing terbaik di Yogyakarta! Dagingnya empuk, bumbu kacang kental, dan lontong fresh. Sangat worth it meskipun sering ramai.",
    lastVisited: "3 hari lalu",
    visited: true,
    notes: "Best sate ever! Bumbu kacangnya mantap sekali.",
    popularMenus: ["Sate Kambing", "Sate Ayam", "Lontong", "Bumbu Kacang"],
  },
  {
    id: 4,
    name: "Bale Raos Keraton",
    category: "Masakan Jawa",
    location: "Jl. Magangan Kulon No. 1, Kraton",
    rating: 4.7,
    reviewCount: 456,
    priceRange: "Rp 50k–200k",
    tags: ["Keraton", "Fine Dining", "Bersejarah"],
    icon: "👑",
    description: "Resep masakan raja-raja Yogyakarta. Pengalaman kuliner yang istimewa dengan presentasi elegan dan rasa yang autentik.",
    lastVisited: "2 minggu lalu",
    visited: false,
    notes: "Pengin coba resep masakan raja-raja.",
    popularMenus: ["Gado-gado Royal", "Perkedel Istimewa", "Sambal Goreng Hati", "Soto Ayam"],
  },
  {
    id: 5,
    name: "Mangut Lele Mbah Marto",
    category: "Masakan Jawa",
    location: "Jl. Parangtritis, Sewon, Bantul",
    rating: 4.7,
    reviewCount: 721,
    priceRange: "Rp 20k–45k",
    tags: ["Mangut Lele", "Pedas", "Legendaris"],
    icon: "🐟",
    description: "Legenda kuliner Yogyakarta! Mangut lele yang pedas dan gurih, sempurna untuk pecinta makanan dengan sensasi cita rasa yang kuat.",
    lastVisited: "1 bulan lalu",
    visited: true,
    notes: "Mangut lele-nya pedas tapi nikmat. Cocok untuk yang suka pedas.",
    popularMenus: ["Mangut Lele", "Lele Goreng", "Nasi Putih", "Sambal Matah"],
  },
  {
    id: 6,
    name: "Jejamuran Restaurant",
    category: "Masakan Jawa",
    location: "Niwen, Nogotirto, Sleman",
    rating: 4.5,
    reviewCount: 1023,
    priceRange: "Rp 25k–80k",
    tags: ["Jamur", "Unik", "Keluarga"],
    icon: "🍄",
    description: "Menu unik semuanya berbahan dasar jamur. Pilihan sempurna untuk vegetarian dan mereka yang mencari pengalaman kuliner yang berbeda.",
    lastVisited: "2 minggu lalu",
    visited: false,
    notes: "",
    popularMenus: ["Jamur Goreng", "Sup Jamur", "Jamur Lada Hitam", "Nasi Goreng Jamur"],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState('profile')
  const [favorites, setFavorites] = useState(initialFavorites)

  const handleUpdateFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites)
  }

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const handleUpdateNoteFavorite = (id, notes) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, notes } : f))
    )
  }

  const handleUpdateVisitedFavorite = (id, visited) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visited } : f))
    )
  }

  return (
    <>
      {currentPage === 'profile' && (
        <ProfilePage
          favorites={favorites}
          onNavigateToFavorite={() => setCurrentPage('favorite')}
        />
      )}
      {currentPage === 'favorite' && (
        <FavoritePage
          favorites={favorites}
          onRemove={handleRemoveFavorite}
          onUpdateNotes={handleUpdateNoteFavorite}
          onUpdateVisited={handleUpdateVisitedFavorite}
          onNavigateToProfile={() => setCurrentPage('profile')}
        />
      )}
    </>
  )
}

export default App
