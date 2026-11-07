/** Existing four-leaf mark, transcribed from PortfolioSequence.module.css:671–704.
 * Editable inline SVG; no raster derivative or new brand design. */
export const LEGITILS_BRAND = {
  gradients: [['#a020ed','#6c28ff'],['#12c7ee','#2457ff'],['#ff188f','#ff5160'],['#ff5a30','#ffb50a']],
  text: [['0%','#0b99ed'],['18%','#4a37ff'],['39%','#b21cdf'],['57%','#eb109b'],['78%','#fb3c69'],['100%','#ff9a0d']],
  leaves: ['M0 0 25 10.5 25 25 0 19Z','M27 10.5 52 0 52 19 27 25Z','M0 34.75 25 27 25 41.5 0 52Z','M27 27 52 34.75 52 52 27 41.5Z'],
} as const;
export function BrandDefinitions() {
  return <>
    {LEGITILS_BRAND.gradients.map((colours,i)=><linearGradient id={`film-leaf-${i}`} key={i} x1="0" y1="0" x2="1" y2="1"><stop stopColor={colours[0]}/><stop offset="1" stopColor={colours[1]}/></linearGradient>)}
    <linearGradient id="film-brand" x1="0" y1="0" x2="1" y2=".18">{LEGITILS_BRAND.text.map(([offset,colour])=><stop key={offset} offset={offset} stopColor={colour}/>)}</linearGradient>
  </>;
}
export default function BrandMark() {
  return <g data-brand-mark="legitils">{LEGITILS_BRAND.leaves.map((path,i)=><path key={i} d={path} fill={`url(#film-leaf-${i})`}/>)}</g>;
}
