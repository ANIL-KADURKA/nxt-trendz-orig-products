import {Component} from 'react'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const apiConstantsProductItemDetails = {
  success: 'SUCCESS',
  failure: 'failure',
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    activeProductDetails: {},
    apiStatus: apiConstantsProductItemDetails.initial,
    cartCount: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiConstantsProductItemDetails.in_progress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const upDatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        price: fetchedData.price,
        title: fetchedData.title,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          title: each.title,
          style: each.style,
          price: each.price,
          description: each.description,
          brand: each.brand,
          totalReviews: each.total_reviews,
          rating: each.rating,
          availability: each.availability,
        })),
      }
      this.setState({
        activeProductDetails: upDatedData,
        apiStatus: apiConstantsProductItemDetails.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstantsProductItemDetails.failure,
      })
    }
  }

  onIncreaseButton = () => {
    this.setState(prevState => ({
      cartCount: prevState.cartCount + 1,
    }))
  }

  onDecreaseButton = () => {
    const {cartCount} = this.state
    if (cartCount !== 1) {
      this.setState(prevState => ({
        cartCount: prevState.cartCount - 1,
      }))
    }
  }

  renderSimilarProduct = () => {
    const {activeProductDetails} = this.state
    const {similarProducts} = activeProductDetails
    return (
      <ul className="ul-container">
        {similarProducts &&
          similarProducts.map(each => (
            <SimilarProductItem SimilarProductEachItem={each} key={each.id} />
          ))}
      </ul>
    )
  }

  renderProductDetails() {
    const {activeProductDetails, cartCount} = this.state

    const {
      imageUrl,
      title,
      brand,
      price,
      description,
      totalReviews,
      rating,
      availability,
    } = activeProductDetails

    return (
      <>
        <div className="product-item-details-container">
          <img src={imageUrl} className="image-element" alt="product" />
          <div className="details-container">
            <h1 className="title-head">{title}</h1>
            <p className="priced">Rs {price}/- </p>
            <div className="product-details-c">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div>
              <p className="available">
                <span className="ava-brand">Available: </span>
                {availability}
              </p>
              <p className="available">
                <span className="ava-brand">Brand: </span> {brand}
              </p>
            </div>
            <hr className="line" />
            <div className="icons-container">
              <button
                type="button"
                onClick={this.onDecreaseButton}
                data-testid="minus"
                className="filter-icon"
              >
                <BsDashSquare />
              </button>
              <p className="cart-count">{cartCount} </p>
              <button
                type="button"
                className="filter-icon"
                data-testid="plus"
                onClick={this.onIncreaseButton}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container-similar">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="similar-failure-image"
      />
      <h1 className="head">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="similar-failure-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    return (
      <div className="final-container">
        <Header />
        {(() => {
          switch (apiStatus) {
            case apiConstantsProductItemDetails.success:
              return this.renderProductDetails()
            case apiConstantsProductItemDetails.failure:
              return this.renderFailureView()
            case apiConstantsProductItemDetails.in_progress:
              return this.renderLoaderView()
            default:
              return null
          }
        })()}
        {this.renderSimilarProduct()}
      </div>
    )
  }
}

export default ProductItemDetails
