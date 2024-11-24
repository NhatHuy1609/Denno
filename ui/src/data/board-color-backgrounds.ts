import  { StaticImageData } from 'next/image'
// SOLID BACKGROUND
import BlueSky from 'public/board/backgrounds/colors/solid/blue-sky.jpg'
import Brown from 'public/board/backgrounds/colors/solid/brown.jpg'
import Green from 'public/board/backgrounds/colors/solid/green.jpg'
import Mint from 'public/board/backgrounds/colors/solid/mint.jpg'
import Orange from 'public/board/backgrounds/colors/solid/orange.jpg'
import Pink from 'public/board/backgrounds/colors/solid/pink.jpg'
import Purple from 'public/board/backgrounds/colors/solid/purple.jpg'
import Red from 'public/board/backgrounds/colors/solid/red.jpg'
import Yellow from 'public/board/backgrounds/colors/solid/yellow.jpg'
// LINEAR BACKGROUND
import Ali from 'public/board/backgrounds/colors/linear/ali.jpg'
import Decent from 'public/board/backgrounds/colors/linear/decent.jpg'
import Titanium from 'public/board/backgrounds/colors/linear/titanium.jpg'
import Haikus from 'public/board/backgrounds/colors/linear/haikus.jpg'
import Pizelex from 'public/board/backgrounds/colors/linear/pizelex.jpg'
import Politics from 'public/board/backgrounds/colors/linear/politics.jpg'
import Purplin from 'public/board/backgrounds/colors/linear/purplin.jpg'
import BackToEarth from 'public/board/backgrounds/colors/linear/back-to-earth.jpg'
import BackToTheFuture from 'public/board/backgrounds/colors/linear/back-to-the-future.jpg'

export type BoardColorBackgroundImage = {
  imageName: string
  imageSrc: StaticImageData
}

export const SOLID_PALETTE: Array<BoardColorBackgroundImage> = [
  { imageName: 'blue-sky', imageSrc: BlueSky },
  { imageName: 'red', imageSrc: Red },
  { imageName: 'yellow', imageSrc: Yellow },
  { imageName: 'purple', imageSrc: Purple },
  { imageName: 'green', imageSrc: Green },
  { imageName: 'brown', imageSrc: Brown },
  { imageName: 'orange', imageSrc: Orange },
  { imageName: 'mint', imageSrc: Mint },
  { imageName: 'pink', imageSrc: Pink }
]

export const LINEAR_PALETTE: Array<BoardColorBackgroundImage> = [
  { imageName: 'ali', imageSrc: Ali },
  { imageName: 'decent', imageSrc: Decent },
  { imageName: 'purplin', imageSrc: Purplin },
  { imageName: 'politics', imageSrc: Politics },
  { imageName: 'haikus', imageSrc: Haikus },
  { imageName: 'pizelex', imageSrc: Pizelex },
  { imageName: 'titanium', imageSrc: Titanium },
  { imageName: 'back-to-the-future', imageSrc: BackToTheFuture },
  { imageName: 'back-to-earth', imageSrc: BackToEarth },
]