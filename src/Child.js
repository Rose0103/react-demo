import React, { Component } from 'react'
import style from './Child.module.scss'
console.log(style);
export default class Child extends Component {
  render() {
    return (
      <div>
        <h1 className={style.item}>我是Child</h1>
      </div>
    )
  }
}
