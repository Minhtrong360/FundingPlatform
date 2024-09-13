const CategoryCard = ({
  uniqueCategories,
  handleCategoryClick,
  selectedCategory,
}) => {
  return (
    <div class="widget">
      <h3 class="wp-block-heading">Categories:</h3>
      <ul className="list-none">
        {uniqueCategories.map((category) => (
          <li
            key={category}
            className={`flex items-center space-x-2 cursor-pointer ${
              selectedCategory === category ? "font-bold" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="text-base">{category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCard;
