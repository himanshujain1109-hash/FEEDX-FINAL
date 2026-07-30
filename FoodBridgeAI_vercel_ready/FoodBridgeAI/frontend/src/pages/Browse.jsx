import { useEffect, useState } from "react";
import api from "../api/client";
import FoodCard from "../components/FoodCard";

export default function Browse() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = { status: "available" };
      if (search) params.search = search;
      if (foodType) params.foodType = foodType;
      const res = await api.get("/food", { params });
      setFoods(res.data.foods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Available food nearby</h1>
      <p className="mt-2 text-ink/60">Every listing here is fresh, verified, and ready for pickup.</p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Search e.g. rice, bread, curry"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-[160px]" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
          <option value="">All types</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-veg</option>
        </select>
        <button type="submit" className="btn-secondary !px-6 !py-2">
          Search
        </button>
      </form>

      {loading ? (
        <p className="mt-10 text-ink/60">Loading listings...</p>
      ) : foods.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
          No available food matches your search right now. Check back soon.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}
