import { Layout, Page, Card, Stack, Select, TextField, CalloutCard, SettingToggle, TextStyle, Frame } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';

class Index extends React.Component {
  state = {
    cssSelector: 'christmas-game',
    rewardText: 'Thanks for playing. Enter followign code and you will receive a free T-Shirt with your order',
    rewardCode: 'CODESPHERExMALT',
  };

  componentDidMount() {
    this.getConfig();
  }

  getConfig() {
    fetch("/config")
    .then(res => res.json())
    .then(({ success, config }) => {
        if (success) {
          this.setState({ ...config });
        } else {
          console.error(success, css);
        }
      }
    )
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  saveConfig() {
    this.setState()

    fetch('/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          cssSelector: this.state.cssSelector,
          rewardText: this.state.rewardText,
          rewardCode:  this.state.rewardCode,
        }
      }),
    })
    .then(response => response.json())
    .then(({ success }) => {
      if (success) {
        console.log(success);
      } else {
        console.error(success);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  render() {
    return (
      <Page>
        <TitleBar
          title="Settings"
          primaryAction={{
          content: 'Save',
          onAction: () => this.saveConfig(),
        }} />
        <Layout.AnnotatedSection
          title="Settings"
          description="Configure Game Settings"
          >
          <Card>
            <Card.Section>
              <Stack alignment="fill" vertical="true">
                <Stack.Item>
                  <TextField label="CSS Selector (by ID)" placeholder="Estimated Shipping" value={this.state.cssSelector} onChange={(change) => this.setState({cssSelector: change})} />
                </Stack.Item>
                <Stack.Item>
                  <TextField label="Reward Text" placeholder="Free Shipping" value={this.state.rewardText} onChange={(change) => this.setState({rewardText: change})} />
                </Stack.Item>
                <Stack.Item>
                  <TextField label="Reward Code" placeholder="€" value={this.state.rewardCode} onChange={(change) => this.setState({rewardCode: change})} />
                </Stack.Item>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.AnnotatedSection>
      </Page>
    );
  }

  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}

export default Index;