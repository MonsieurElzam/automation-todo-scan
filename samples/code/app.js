// TODO: remplacer le stockage en mémoire par une vraie base
const cache = new Map()
const label = 'TODO dans une chaîne : ne doit pas compter'
function load(id) {
  /* FIXME: gérer l'expiration du cache */
  return cache.get(id)
}
# HACK: contournement temporaire du bug de fuseau
export { load, label }
