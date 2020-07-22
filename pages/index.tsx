import * as React from "react"
import { useEffect, useState } from "react"
import Head from "next/head"
import styled from "styled-components"
import { motion } from "framer-motion"
import Hero from "../components/Landing/Hero"
import HowItWorks from "../components/Landing/HowItWorks"

const IndexPage = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
    </div>
  )
}

export default IndexPage

// Styles
