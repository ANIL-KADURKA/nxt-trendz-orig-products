import './index.css'

const SimilarProductItem = props => {
  const {SimilarProductEachItem} = props
  const {imageUrl, title, price, brand, rating} = SimilarProductEachItem
  return (
    <li className="similar-element">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="price-rated-container">
        <p className="similar-price">Rs {price} /- </p>
        <div className="rating-container-cop">
          <p className="rating-cop">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-cop"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
