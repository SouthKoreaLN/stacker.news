import { Nav, Navbar } from 'react-bootstrap'
import { Brand, NavNotifications, PostItem, SearchItem } from '../common'
import { useMe } from '../../me'
import styles from './footer.module.css'
import classNames from 'classnames'
import Offcanvas from './offcanvas'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function useDetectKeyboardOpen (minKeyboardHeight = 300, defaultValue) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(defaultValue)

  useEffect(() => {
    const listener = () => {
      const newState = window.screen.height - minKeyboardHeight > window.visualViewport.height
      setIsKeyboardOpen(newState)
    }
    if (typeof visualViewport !== 'undefined') {
      window.visualViewport.addEventListener('resize', listener)
    }
    return () => {
      if (typeof visualViewport !== 'undefined') {
        window.visualViewport.removeEventListener('resize', listener)
      }
    }
  }, [setIsKeyboardOpen, minKeyboardHeight])

  return isKeyboardOpen
}

export default function BottomBar ({ sub }) {
  const router = useRouter()
  const me = useMe()
  const isKeyboardOpen = useDetectKeyboardOpen(300, false)

  if (isKeyboardOpen) {
    return null
  }

  const path = router.asPath.split('?')[0]
  const props = {
    prefix: sub ? `/~${sub}` : '',
    path,
    topNavKey: path.split('/')[sub ? 2 : 1] ?? '',
    dropNavKey: path.split('/').slice(sub ? 2 : 1).join('/'),
    sub
  }

  return (
    <div className={classNames('d-block d-md-none', styles.footer)}>
      <Navbar className='container px-0'>
        <Nav className={styles.footerNav}>
          <Offcanvas me={me} {...props} />
          <SearchItem {...props} />
          <Brand />
          <NavNotifications />
          <PostItem {...props} className='btn-sm' />
        </Nav>
      </Navbar>
    </div>
  )
}