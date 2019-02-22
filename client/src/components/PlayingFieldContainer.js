import React, { PureComponent } from "react";
import { Group, Rect, Text } from "react-konva";
import Konva from 'konva'
// does not resize on window size change
export const WIDTH = 950;
export const HEIGHT = 475;

const imageUrl = "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.iSZhCBEI6zB8PWdWJc_tJgHaJQ%26pid%3D15.1&f=1"

export default class PlayingFieldContainer extends PureComponent {

  constructor(...args) {
    super(...args);
    const image = new window.Image()
    image.onload = () => {
      this.setState({
        fillPatternImage: image
      })
    }
    image.src = imageUrl
    this.state = {
      color: 'green',
      fillPatternImage: null
    }
  }



  render() {

    return (

      <Group>
        <Rect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          fill="rgb(0,0,0)"
          shadowBlur={2}
        />
        <Rect
          x={2}
          y={2}
          width={WIDTH - 4}
          height={HEIGHT - 4}
          fillPatternImage={this.state.fillPatternImage}
        />
      </Group>


    );
  }
}