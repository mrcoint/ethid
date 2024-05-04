import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#EF6C00',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EF6C00',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};


function AIClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const self = this;
    const { steps } = this.props;
    const search = steps.search.value;

    fetch('https://httpbin.org/get')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );
}



class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps.search?.value;
    //const endpoint = encodeURI('http://localhost:5000');
    
    function readyStateChange() {
      if (this.readyState === 4) {
        const data = this.responseText;
        console.log("results: "+ data);
        if(data){
          self.setState({ loading: false, result: data });
        } else {
          self.setState({ loading: false, result: 'Not found.' });
        }
        /*
        const data = JSON.parse(this.responseText);
        console.log("results: "+ data)
        const bindings = data.results.bindings;
        if (bindings && bindings.length > 0) {
          self.setState({ loading: false, result: bindings[0].comment.value });
        } else {
          self.setState({ loading: false, result: 'Not found.' });
        }
        */
      }
    }

    if(search){
      const query = encodeURI(`${search}`);

      const queryUrl = `http://localhost:5000/ask?q=${query}`;

      const xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', readyStateChange);
      
      xhr.open('GET', queryUrl);
      console.log("query URL " + queryUrl);
      xhr.send();
    }

    
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        { loading ? <Loading /> : result }
        {
          !loading &&
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {
              !trigger &&
              <button
                onClick={() => this.triggetNext()}
              >
                Search Again
              </button>
            }
          </div>
        }
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const Chat = () => (
  <ThemeProvider theme={theme}>
    <ChatBot
      steps={[
        {
          id: '1',
          message: 'Type something to search on our AI. (ie.: What do you do?)',
          trigger: 'search',
        },
        {
          id: 'search',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          component: <DBPedia />,
          waitAction: true,
          trigger: 'search',
        },
      ]}
    />
  </ThemeProvider>
);

export default Chat;
