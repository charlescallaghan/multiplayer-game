import React, { PureComponent } from "react";
import { Circle } from "react-konva";
import { WIDTH, HEIGHT } from "./PlayingFieldContainer";
import { movePuck } from '../actions/puck'
import { connect } from 'react-redux'

const
    // no longer needed?
    // initialX = WIDTH / 2,
    // initialY = HEIGHT / 2,
    MAX_X = WIDTH,
    MAX_Y = HEIGHT


class Puck extends PureComponent {

    move = () => {

        this.props.movePuck({ velocityX: this.props.puck.velocityX * this.props.puck.frictionX })
        this.props.movePuck({ velocityY: this.props.puck.velocityY * this.props.puck.frictionY })

        this.props.movePuck({ positionX: this.props.puck.positionX + this.props.puck.velocityX })
        this.props.movePuck({ positionY: this.props.puck.positionY + this.props.puck.velocityY })
    }

    componentDidMount() {
        this.animate()
    }

    animate = () => {
        requestAnimationFrame(this.animate)
        this.move()
    }

    keepPuckInsideField = () => {

        // puck does not slow down upon collision.
        // If desired, add slow down multiplier to:
        // -this.props.puck.${velocityDirection} * ${brakeFactor}
        // X-axis borders

        if (this.props.puck.positionX > (MAX_X - this.props.puck.puckSize)) {
            this.props.movePuck({
                positionX: MAX_X - this.props.puck.puckSize,
                velocityX: -this.props.puck.velocityX
            })
        }
        // Y-axis borders
        if (this.props.puck.positionY > MAX_Y) {
            this.props.movePuck({
                positionY: MAX_Y,
                velocityY: -this.props.puck.velocityY
            })
        }
        if (this.props.puck.positionY < (0 + this.props.puck.puckSize)) {
            this.props.movePuck({
                positionY: 0 + this.props.puck.puckSize,
                velocityY: -this.props.puck.velocityY
            })
        }
    }

    componentDidUpdate() {
        this.keepPuckInsideField()
        this.checkCollision(this.props.playerOne, this.props.puck)
        this.checkCollision(this.props.playerTwo, this.props.puck)

    }

    rotate(positionX, positionY, sin, cos, reverse) {
        return {

            positionX: (reverse) ? (positionX * cos + positionY * sin)
                : (positionX * cos - positionY * sin),

            positionY: (reverse) ? (positionY * cos - positionX * sin)
                : (positionY * cos + positionX * sin)
        };
    }


    checkCollision(puck, player) {
        const distanceX = player.positionX - puck.positionX,
            distanceY = player.positionY - puck.positionY,
            distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY),
            addedRadius = player.puckSize + puck.puckSize

   
        if (distance < addedRadius) {
            // all collision logic goes here    
            let angle = Math.atan2(distanceY, distanceX),
                sin = Math.sin(angle),
                cos = Math.cos(angle),

                positionPuck = { positionX: 0, positionY: 0 },
                positionPlayer = this.rotate(distanceX, distanceY, sin, cos, true),
                velocityPuck = this.rotate(puck.velocityX, puck.velocityY, sin, cos, true),
                velocityPlayer = this.rotate(player.velocityX, player.velocityY, sin, cos, true),
                velocityTotal = velocityPuck.positionX - velocityPlayer.positionX;

            velocityPuck.positionX = ((puck.mass - player.mass) * velocityPuck.positionX + 2 * player.mass * velocityPlayer.positionX) /
                (puck.mass + player.mass);
            velocityPlayer.positionX = velocityTotal + velocityPuck.positionX;

            let absV = Math.abs(velocityPuck.positionX) + Math.abs(velocityPlayer.positionX),
                overlap = (puck.puckSize + player.puckSize) - Math.abs(positionPuck.positionX - positionPlayer.positionX);


            positionPuck.positionX += velocityPuck.positionX / absV * overlap;
            positionPlayer.positionX += velocityPlayer.positionX / absV * overlap

            let positionPuckForce = this.rotate(positionPuck.positionX, positionPuck.positionY, sin, cos, false),
                positionPlayerForce = this.rotate(positionPlayer.positionX, positionPlayer.positionY, sin, cos, false);

            player.positionX = puck.positionX + positionPlayerForce.positionX;
            player.positionY = puck.positionY + positionPlayerForce.positionY;

            puck.positionX = puck.positionX + positionPuckForce.positionX;
            puck.positionY = puck.positionY + positionPuckForce.positionY

            let velocityPuckForce = this.rotate(velocityPuck.positionX, velocityPuck.positionY, sin, cos, false);
            let velocityPlayerForce = this.rotate(velocityPlayer.positionX, velocityPlayer.positionY, sin, cos, false);

            puck.velocityX = velocityPuckForce.positionX;
            puck.velocityY = velocityPuckForce.positionY;

            player.velocityX = velocityPlayerForce.positionX;
            player.velocityY = velocityPlayerForce.positionY;

        }
    }

    render() {
        return (
            <Circle
                x={this.props.puck.positionX}
                y={this.props.puck.positionY}
                radius={this.props.puck.puckSize}
                fill={'grey'}
                stroke={'black'}
                strokeWidth={2}
                mass={this.props.puck.mass}
                velocityX={this.props.puck.velocityX}
                velocityY={this.props.puck.velocityY}
                frictionX={this.props.puck.frictionX}
                frictionY={this.props.puck.frictionY}
                acceleration={this.props.puck.acceleration}
            />
        );
    }

}




const mapStateToProps = state => {
    return {
        puck: state.puck,
        playerOne: state.playerOne,
        playerTwo: state.playerTwo
    }
}


export default connect(mapStateToProps, { movePuck })(Puck)
