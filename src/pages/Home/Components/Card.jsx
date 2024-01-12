const Card = ({ title, description, imageUrl, buttonText, buttonLink }) => (
  <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  hover:border-transparent hover:shadow-lg transition-all duration-300">
    <a href={buttonLink}>
      <img className="rounded-t-lg" src={imageUrl} alt={title} />
    </a>
    <div className="p-5">
      <a href={buttonLink}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
      <a
        href={buttonLink}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
      >
        {buttonText}
      </a>
    </div>
  </div>
);

export default Card;
