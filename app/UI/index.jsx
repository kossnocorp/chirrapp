import { h, Component } from 'preact'
import Editor from './Editor'
import Done from './Done'
import './style.css'

export default class UI extends Component {
  render ({}, { page = 'editor', publishedURLs, prefilledText }) {
    switch (page) {
      case 'editor':
        return (
          <Editor
            prefilledText={prefilledText}
            onPublish={urls =>
              this.setState({ page: 'done', publishedURLs: urls })}
          />
        )

      case 'done':
        return (
          <Done
            onBack={text => {
              this.setState({ page: 'editor', prefilledText: text })
            }}
            publishedURLs={publishedURLs}
          />
        )
    }
  }
}
