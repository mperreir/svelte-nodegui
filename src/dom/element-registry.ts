import { View } from 'tns-core-modules/ui/core/view'
import ViewNode from './ViewNode'


type ComponentClassResolver = () => View;

interface ElementEntry {
  resolver: ComponentClassResolver,
  meta: ComponentMeta
}

export interface ComponentMeta {
    skipAddToDom?: boolean
    isUnaryTag?: boolean
    tagNamespace?: string
    canBeLeftOpenTag?: boolean
    component?: View
    insertChild?: (parent: ViewNode, child: ViewNode, index: number) => void;
    removeChild?: (parent: ViewNode, child: ViewNode) => void;
}

const elementMap:{ [index: string]: ElementEntry}  = {}
const dashRegExp = /-/g

const defaultViewMeta = {
  skipAddToDom: false,
  isUnaryTag: false,
  tagNamespace: '',
  canBeLeftOpenTag: false,
  component: null as View
}

export function normalizeElementName(elementName: string) {
  return `${elementName
    .replace(dashRegExp, '')
    .toLowerCase()}`
}

export function registerElement(elementName:string, resolver: ComponentClassResolver, meta: ComponentMeta = null) {
  const normalizedName = normalizeElementName(elementName)

  meta = Object.assign({}, defaultViewMeta, meta)

  if (elementMap[normalizedName]) {
    throw new Error(`Element for ${elementName} already registered.`)
  }

//  if (!meta.component) {
//    meta.component = {}
//  }
//  meta.component.name = elementName

  const entry = {
    resolver: resolver,
    meta: meta
  }
  elementMap[normalizedName] = entry
}

export function getElementMap() {
  return elementMap
}

export function getViewClass(elementName:string) {
  const normalizedName = normalizeElementName(elementName)
  const entry = elementMap[normalizedName]

  if (!entry) {
    throw new TypeError(`No known component for element ${elementName}.`)
  }

  try {
    return entry.resolver()
  } catch (e) {
    throw new TypeError(`Could not load view for: ${elementName}. ${e}`)
  }
}

export function getViewMeta(elementName:string) {
  const normalizedName = normalizeElementName(elementName)

  let meta:ComponentMeta = defaultViewMeta
  const entry = elementMap[normalizedName]

  if (entry && entry.meta) {
    meta = entry.meta
  }

  return meta
}

export function isKnownView(elementName:string) {
  return elementMap[normalizeElementName(elementName)]
}

registerElement(
  'ActionBar',
  () => require('tns-core-modules/ui/action-bar').ActionBar,
  {
    removeChild(parent, child) {
      try {
        parent.nativeView._removeView(child.nativeView)
      } catch (e) {
        // ignore exception - child is likely already removed/replaced
        // fixes #76
      }
    },
  }
)

registerElement(
  'ActionItem',
  () => require('tns-core-modules/ui/action-bar').ActionItem
)


registerElement(
  'ListView',
  () => require('tns-core-modules/ui/list-view').ListView
)

registerElement(
  'NavigationButton',
  () => require('tns-core-modules/ui/action-bar').NavigationButton
)

registerElement(
  'TabView',
  () => require('tns-core-modules/ui/tab-view').TabView
)

registerElement(
  'TabViewItem',
  () => require('tns-core-modules/ui/tab-view').TabViewItem
)


// NS components which uses the automatic registerElement Vue wrapper
// as they do not need any special logic

registerElement('Label', () => require('tns-core-modules/ui/label').Label)

registerElement(
  'DatePicker',
  () => require('tns-core-modules/ui/date-picker').DatePicker,
)

registerElement(
  'AbsoluteLayout',
  () => require('tns-core-modules/ui/layouts/absolute-layout').AbsoluteLayout
)
registerElement(
  'ActivityIndicator',
  () => require('tns-core-modules/ui/activity-indicator').ActivityIndicator
)
registerElement('Border', () => require('tns-core-modules/ui/border').Border)
registerElement('Button', () => require('tns-core-modules/ui/button').Button)
registerElement(
  'ContentView',
  () => require('tns-core-modules/ui/content-view').ContentView
)
registerElement(
  'DockLayout',
  () => require('tns-core-modules/ui/layouts/dock-layout').DockLayout
)
registerElement(
  'GridLayout',
  () => require('tns-core-modules/ui/layouts/grid-layout').GridLayout
)
registerElement(
  'HtmlView',
  () => require('tns-core-modules/ui/html-view').HtmlView
)
registerElement('Image', () => require('tns-core-modules/ui/image').Image)
registerElement('img', () => require('tns-core-modules/ui/image').Image)
registerElement(
  'ListPicker',
  () => require('tns-core-modules/ui/list-picker').ListPicker,
)
registerElement('Page', () => require('tns-core-modules/ui/page').Page, {
  skipAddToDom: true,
})

registerElement(
  'Placeholder',
  () => require('tns-core-modules/ui/placeholder').Placeholder
)
registerElement(
  'Progress',
  () => require('tns-core-modules/ui/progress').Progress,
)
registerElement(
  'ProxyViewContainer',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer
)
// registerElement(
//   'Repeater',
//   () => require('tns-core-modules/ui/repeater').Repeater
// )
registerElement(
  'ScrollView',
  () => require('tns-core-modules/ui/scroll-view').ScrollView
)
registerElement(
  'SearchBar',
  () => require('tns-core-modules/ui/search-bar').SearchBar,
)
registerElement(
  'SegmentedBar',
  () => require('tns-core-modules/ui/segmented-bar').SegmentedBar,
)
registerElement(
  'SegmentedBarItem',
  () => require('tns-core-modules/ui/segmented-bar').SegmentedBarItem
)
registerElement('Slider', () => require('tns-core-modules/ui/slider').Slider)
registerElement(
  'StackLayout',
  () => require('tns-core-modules/ui/layouts/stack-layout').StackLayout
)
registerElement(
  'FlexboxLayout',
  () => require('tns-core-modules/ui/layouts/flexbox-layout').FlexboxLayout
)
registerElement('Switch', () => require('tns-core-modules/ui/switch').Switch, )

registerElement(
  'TextField',
  () => require('tns-core-modules/ui/text-field').TextField,
  
)
registerElement(
  'TextView',
  () => require('tns-core-modules/ui/text-view').TextView,
 
)
registerElement(
  'TimePicker',
  () => require('tns-core-modules/ui/time-picker').TimePicker,
 
)
registerElement(
  'WebView',
  () => require('tns-core-modules/ui/web-view').WebView
)
registerElement(
  'WrapLayout',
  () => require('tns-core-modules/ui/layouts/wrap-layout').WrapLayout
)
registerElement(
  'FormattedString',
  () => require('tns-core-modules/text/formatted-string').FormattedString
)
registerElement('Span', () => require('tns-core-modules/text/span').Span)

registerElement(
  'DetachedContainer',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
)
registerElement(
  'DetachedText',
  () => require('tns-core-modules/ui/placeholder').Placeholder,
  {
    skipAddToDom: true
  }
)
registerElement(
  'Comment',
  () => require('tns-core-modules/ui/placeholder').Placeholder
)

registerElement(
  'Document',
  () => require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer,
  {
    skipAddToDom: true
  }
)

registerElement('Frame', () => require('tns-core-modules/ui/frame').Frame,
 {
  insertChild(parentNode, childNode, atIndex) {
    // if (normalizeElementName(childNode.tagName) === 'nativepage') {
    // parentNode.nativeView.navigate({ create: () => childNode.nativeView })
    // }
  },
 }
)

registerElement('head', () => null, {
  insertChild(parentNode, childNode, atIndex) {
    if (normalizeElementName(childNode.tagName) === 'style') {
       //find the top frame el
       let frame:ViewNode = null;
       for (let el of parentNode.ownerDocument.childNodes) {
          if (normalizeElementName(el.tagName) == 'frame') {
             frame = el;
          }
       }
       
       if (frame) {
          let css:string = (childNode as any).textContent;
          //let el = frame.__SvelteNativeElement__;
          console.log("adding frame css", css );
          frame.nativeView.addCss((childNode as any).textContent);
          console.log("frame css is now", frame.nativeView.css);
       } else {
         console.log("there was no top frame when style was declared");
       }
    }
  },
})

registerElement('style', () => null)

