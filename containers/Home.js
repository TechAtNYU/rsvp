import { connect } from 'react-redux';
import { toggleEvent, rsvpToEvents } from '../actions';
import EventList from '../components/EventList';

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div>
        <VisibleEventList />
        </div>
    }
}

// const VisibleEventList = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Home);

export default Home;