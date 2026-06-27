/**
 * Utility functions for the campaign applet.
 */

/**
 * Returns a descriptive emoji based on the donation category name.
 * Highly robust, case-insensitive, and covers a wide array of synonyms.
 */
export function getCategoryEmoji(category: string): string {
  if (!category) return '📦';
  const cat = category.toLowerCase();
  
  if (
    cat.includes('aliment') || 
    cat.includes('comid') || 
    cat.includes('arroz') || 
    cat.includes('pereceder') || 
    cat.includes('enlat') || 
    cat.includes('harin') || 
    cat.includes('past') || 
    cat.includes('grano') ||
    cat.includes('lentej') ||
    cat.includes('garban') ||
    cat.includes('atun') ||
    cat.includes('atún')
  ) {
    return '🥫'; // Canned / Non-perishable food
  }
  
  if (
    cat.includes('rop') || 
    cat.includes('abrig') || 
    cat.includes('calzad') || 
    cat.includes('vestir') || 
    cat.includes('mant') || 
    cat.includes('cobij') || 
    cat.includes('sueter') || 
    cat.includes('pantal') ||
    cat.includes('medias') ||
    cat.includes('zapat') ||
    cat.includes('chaquet')
  ) {
    return '🧥'; // Clothing/Coats
  }
  
  if (
    cat.includes('medicin') || 
    cat.includes('médic') || 
    cat.includes('farmac') || 
    cat.includes('salud') || 
    cat.includes('botiqu') || 
    cat.includes('gas') || 
    cat.includes('alcohol') || 
    cat.includes('venda') ||
    cat.includes('primeros aux') ||
    cat.includes('analges') ||
    cat.includes('paracet') ||
    cat.includes('ibuprof')
  ) {
    return '💊'; // Medical/Medicines
  }
  
  if (
    cat.includes('agu') || 
    cat.includes('potabl') || 
    cat.includes('bebid') || 
    cat.includes('botell') || 
    cat.includes('fluid') || 
    cat.includes('liquid') ||
    cat.includes('líquid')
  ) {
    return '💧'; // Water/Drinks
  }
  
  if (
    cat.includes('infantil') || 
    cat.includes('bebé') || 
    cat.includes('bebe') || 
    cat.includes('pañal') || 
    cat.includes('panal') || 
    cat.includes('formul') || 
    cat.includes('fórmul') || 
    cat.includes('niñ') || 
    cat.includes('leche m') ||
    cat.includes('teter')
  ) {
    return '🍼'; // Baby Care/Infant Formulas
  }
  
  if (
    cat.includes('bater') || 
    cat.includes('pil') || 
    cat.includes('lintern') || 
    cat.includes('energi') || 
    cat.includes('energí') || 
    cat.includes('electric') ||
    cat.includes('generador')
  ) {
    return '🔋'; // Battery/Power
  }
  
  if (
    cat.includes('higien') || 
    cat.includes('limp') || 
    cat.includes('aseo') || 
    cat.includes('jabon') || 
    cat.includes('jabón') || 
    cat.includes('crem') || 
    cat.includes('dent') ||
    cat.includes('toall') ||
    cat.includes('desodor') ||
    cat.includes('champ') ||
    cat.includes('shamp')
  ) {
    return '🧼'; // Hygiene/Cleaning
  }
  
  if (
    cat.includes('juguet') || 
    cat.includes('recreac') || 
    cat.includes('peluch') || 
    cat.includes('jueg') ||
    cat.includes('recreo')
  ) {
    return '🧸'; // Toys/Recreation
  }
  
  return '📦'; // Default general package
}
