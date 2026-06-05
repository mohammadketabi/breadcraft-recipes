import { Link } from "react-router-dom";

export default function CategoryFilter({ categories, activeSlug }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <Link
          key={category.slug}
          to={category.slug === "all" ? "/" : `/category/${category.slug}`}
          className={`category-link ${activeSlug === category.slug ? "category-link--active" : ""}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
