import * as React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { FaTimes } from "react-icons/fa"

interface Props {
  xVal: number
  yVal: number
  setRightMenuVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface RightMenuStyledProps {
  xVal: number
  yVal: number
}

const RightMenu: React.FC<Props> = React.memo(
  ({ xVal, yVal, setRightMenuVisible }) => {
    return (
      <RightMenuWrapper
        xVal={xVal}
        yVal={yVal}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.1 }}
      >
        <RightMenuList>
          <RightMenuListItem
            onClick={() => {
              // toggleDeleteAction()
              setRightMenuVisible(false)
            }}
          >
            <DeleteIcon />
            Delete
          </RightMenuListItem>
        </RightMenuList>
      </RightMenuWrapper>
    )
  }
)

export default RightMenu

// Styles
const RightMenuWrapper = styled(motion.div)`
  position: absolute;
  left: ${(props: RightMenuStyledProps) => props.xVal && props.xVal + "px"};
  top: ${(props: RightMenuStyledProps) => props.yVal && props.yVal + "px"};
  z-index: 10;
  padding: 1.5rem 1.5rem;
  width: 15rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 7px 15px;
  border-radius: 5px;
  background: var(--primaryColor);
`

const RightMenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  & > :not(:last-child) {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
`

const RightMenuListItem = styled.li`
  font-size: 1.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    font-weight: 600;
  }
`

const DeleteIcon = styled(FaTimes)`
  margin-right: 5px;
  color: red;
`
