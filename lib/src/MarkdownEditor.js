import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Dimensions
} from 'react-native';
import Markdown from 'react-native-markdown-package';

import { renderFormatButtons } from './renderButtons';

export let FOREGROUND_COLOR = 'black';

const styles = StyleSheet.create({
  composeText: {
    flexDirection: 'column',
    flex: 1,
    fontSize: 16
  },
  buttonContainer: {
    flex: 0,
    marginBottom:20,
    flexDirection: 'row',
  },
  inlinePadding: {
    padding: 4,
  },
  preview: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  screen: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
});

const markdownStyle = {
  autolink: {
    color: 'blue',
  },
  blockQuoteText: {
    color: 'grey'
  },
  blockQuoteSection: {
    flexDirection: 'row',
  },
  blockQuoteSectionBar: {
    width: 3,
    height: null,
    backgroundColor: '#DDDDDD',
    marginRight: 15,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImageView: {
    flex: 1,
    overflow: 'hidden',
  },
  view: {
    alignSelf: 'stretch',
  },
  codeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'Monospace',
    fontWeight: '500',
    backgroundColor: '#DDDDDD',
  },
  del: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  em: {
    fontStyle: 'italic',
  },
  heading: {
    fontWeight: '200',
  },
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  hr: {
    backgroundColor: '#cccccc',
    height: 1,
  },
  image: {
    height: 200, // Image maximum height
    width: Dimensions.get('window').width - 30, // Width based on the window width
    alignSelf: 'center',
    resizeMode: 'contain', // The image will scale uniformly (maintaining aspect ratio)
  },
  imageBox: {
    flex: 1,
    resizeMode: 'cover',
  },
  inlineCode: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'Monospace',
    fontWeight: 'bold',
  },
  list: {
  },
  sublist: {
    paddingLeft: 20,
    width: Dimensions.get('window').width - 60,
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemText: {
    flex: 1,
  },
  listItemBullet: {
    fontSize: 20,
    lineHeight: 20,
  },
  listItemNumber: {
    color: '#97C0D8',
    fontWeight: 'bold',
  },
  listRow: {
    flexDirection: 'row',
  },
  paragraph: {
    marginTop: 5,
    marginBottom: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paragraphCenter: {
    marginTop: 5,
    marginBottom: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  paragraphWithImage: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    //borderBottomWidth: 1,
    borderColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableRowLast: {
    borderColor: 'transparent',
  },
  tableRowCell: {
    padding: 5,
  },
  text: {
    color: '#222222',
  },
  textRow: {
    flexDirection: 'row',
  },
  u: {
    borderColor: '#222222',
    borderBottomWidth: 1,
  },
};

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    const onlyPreview = props.onlyPreview === true
    this.state = {
      text: props.defaultText || '',
      selection: { start: 0, end: 0 },
      showPreview: onlyPreview ? true : props.showPreview ? props.showPreview : false,
    };
  }
  textInput: TextInput;

  changeText = (input: string) => {
    this.setState({ text: input });
    if (this.props.onMarkdownChange) this.props.onMarkdownChange(input);
  };

  onSelectionChange = event => {
    this.setState({
      selection: event.nativeEvent.selection,
    });
  };

  componentDidMount() {
    !this.props.showPreview && this.textInput.focus();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.defaultText !== this.props.defaultText && this.state.text !== this.props.defaultText) {
      this.changeText(this.props.defaultText)
    }
  }

  getState = () => {
    this.setState({
      selection: {
        start: 1,
        end: 1,
      },
      showPreview: false
    });
    return this.state;
  };

  convertMarkdown = () => {
    if(this.props.onlyPreview !== true) {
      this.setState({ showPreview: !this.state.showPreview },() => {
        if (this.state.showPreview) {
          this.textInput.blur();
        } else {
          this.textInput.focus();
        }
      });
    }
  };

  renderPreview = () => {
    const backgroundColor = this.props.style?.backgroundColor ?? 'transparent'
    return (
      <View style={[styles.preview, { backgroundColor }]}>
        <ScrollView>
        <Markdown 
            styles={StyleSheet.flatten([markdownStyle, this.props.markdownStyle])} 
            onLink={(url) => Linking.openURL(url)}
          >
            {this.state.text === '' ? this.props.placeholder : this.state.text} 
          </Markdown>
        </ScrollView>
      </View>
    );
  };

  render() {
    const WrapperView = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const { Formats, markdownButton, foregroundColor, ...otherProps } = this.props;
    const { text, selection, showPreview } = this.state;
    const onlyPreview = this.props.onlyPreview === true;
    FOREGROUND_COLOR = foregroundColor;

    return (
      <WrapperView behavior="padding" style={styles.screen}>
        <TextInput
          style={styles.composeText}
          {...otherProps}
          multiline
          onChangeText={this.changeText}
          onSelectionChange={this.onSelectionChange}
          value={text}
          placeholder={otherProps.placeholder}
          ref={textInput => (this.textInput = textInput)}
        />
        {showPreview ? this.renderPreview() : null}
        {!onlyPreview && <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.convertMarkdown}
            style={{ padding: 8, borderRightWidth: 1, borderColor: FOREGROUND_COLOR }}>
            <Image
              style={[styles.button, { tintColor: FOREGROUND_COLOR, padding: 8 }]}
              source={require('../static/visibility.png')}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
          {renderFormatButtons(
            {
              getState: this.getState,
              setState: (state, callback) => {
                this.textInput.focus();
                this.setState(state, callback);
              },
            },
            Formats,
            markdownButton,
          )}
        </View>}
      </WrapperView>
    );
  }
}
