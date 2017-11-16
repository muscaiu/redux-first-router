// @flow
import type { Action } from '../flow-types'

export default (action: Action): boolean =>
  !!(
    action &&
    action.meta &&
    action.meta.location &&
    action.meta.location.kind === 'redirect'
  )

export const isCommittedRedirect = (action: Action, req) =>
  !!(
    action &&
    action.meta &&
    action.meta.location &&
    action.meta.location.kind === 'redirect' &&
    (req.ctx.committed || action.meta.location.committed)
  )

// `isCommittedRedirect` if `true` triggers the `createRouteAction` middleware to
// do `history.redirect` instead of `history.push`.
//
// This will happen in 2 cases:
// A) user dispatched a route action in the middleware pipeline after `enter` (`req.temp.committed`)
// B) user dispatched a redirect manually using the `redirect` action creator prior to pipeline (`action.meta.location.committed`)
//
// Its primary purpose is case A) where the route will have already changed, and we need to replace it.
// For the latter case see actionCreators/redirect.js for how `.committed` is set to `true` by default.
//
// FINAL NOTE: `utils/createDispatch.js` will in fact override the `action.meta.location.committed` status to
// only honor redirects dispatched prior to the pipeline or the route was in fact entered during the pipeline.
