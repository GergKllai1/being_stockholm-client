import React, { Component } from 'react'
import axios from 'axios'
import Geocode from 'react-geocode'
import moment from 'moment'
import { Container, Image, Icon, Header } from 'semantic-ui-react'

class EntryPopup extends Component {

  state = {
    caption: '',
    category: '',
    created_at: '',
    image: '',
    latitude: '',
    longitude: '',
    address: ''
  }

  async componentDidMount() {
    await axios.get('/api/v1/posts/' + `${this.props.id}`).then(response => {
      this.setState({
        caption: response.data.caption,
        category: response.data.category,
        created_at: response.data.created_at,
        image: response.data.image,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      })
    })
    this.geolocationDataAddress()
  }

  geolocationDataAddress = () => {
    Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE_MAPS)
    Geocode.fromLatLng(parseFloat(this.state.latitude), parseFloat(this.state.longitude)).then(
      response => {
        const address = response.results[0].formatted_address
        this.setState({ address: address })
      },
      error => {
        console.error(error);
      }
    )
  }

  render() {

    let dateString = this.state.created_at
    let dateObj = new Date(dateString)
    let momentObj = moment(dateObj)
    let date = momentObj.format('DD-MM-YYYY')
    let time = momentObj.format('HH:mm')

    return (
      <>
        <Container className={this.state.category} id='entry-wrapper'>

          <Container id='entry-image-wrapper'>
            <Image
              fluid
              rounded
              centered
              verticalAlign='top'
              size='medium'
              id={`image_${this.props.id}`}
              alt='entry image'
              src={this.state.image} />
          </Container>

          <Header id="entry-caption">
            {this.state.caption}
          </Header>

          <Container id='entry-location'>
            <Icon
              name='map marker alternate'
            />
            {this.state.address}
          </Container>

          <Container id='date-container'>
            <p><i> {date} | {time} </i></p>
          </Container>

        </Container>
      </>
    )
  }
}

export default EntryPopup
