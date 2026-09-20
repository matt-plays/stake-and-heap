export interface Quote {
  /** Leading portion of the quote, rendered in the default text color. */
  text: string
  /** Closing phrase, rendered in the accent color. */
  highlight: string
  attribution: string
}

export const quote: Quote = {
  text: '“And the world cannot be discovered by a journey of miles, no matter how long, but only by a spiritual journey, a journey of one inch, very arduous and humbling and joyful, by which we arrive at the ground at our own feet, and ',
  highlight: 'learn to be at home.”',
  attribution: 'Wendell Berry',
}
