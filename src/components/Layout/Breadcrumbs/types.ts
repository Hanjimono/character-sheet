export interface BreadCrumbsItem {
  /** Item title */
  title: string
  /** Item href */
  href: string
}

export interface BreadCrumbsProps {
  /** Classes */
  className?: string
  /** Current page title */
  title?: string
  /** Items for breadcrumbs */
  items?: BreadCrumbsItem[]
}
