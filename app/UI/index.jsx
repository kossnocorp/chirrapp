import { h, Component } from 'preact'
import Editor from './Editor'
import Done from './Done'
import './style.css'

export default class UI extends Component {
  render ({}, { page = 'editor', publishedURLs }) {
    switch (page) {
      case 'editor':
        return (
          <Editor
            onPublish={urls =>
              this.setState({ page: 'done', publishedURLs: urls })}
          />
        )

      case 'done':
        return <Done publishedURLs={publishedURLs} />
    }
  }
}
