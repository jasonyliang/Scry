/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   lib/utils/templatize.html
 */

/// <reference path="boot.d.ts" />
/// <reference path="../mixins/property-effects.d.ts" />
/// <reference path="../mixins/mutable-data.d.ts" />

declare class TemplateInstanceBase extends
  Polymer.PropertyEffects(
  Polymer.Element) {

  /**
   * Find the parent model of this template instance.  The parent model
   * is either another templatize instance that had option `parentModel: true`,
   * or else the host element.
   */
  readonly parentModel: Polymer.PropertyEffects;
  _methodHost: Polymer.PropertyEffects;

  /**
   * Override point for adding custom or simulated event handling.
   *
   * @param node Node to add event listener to
   * @param eventName Name of event
   * @param handler Listener function to add
   */
  _addEventListenerToNode(node: Node, eventName: string, handler: (p0: Event) => void): void;

  /**
   * Overrides default property-effects implementation to intercept
   * textContent bindings while children are "hidden" and cache in
   * private storage for later retrieval.
   *
   * @param node The node to set a property on
   * @param prop The property to set
   * @param value The value to set
   */
  _setUnmanagedPropertyToNode(node: Node, prop: string, value: any): void;

  /**
   * Forwards a host property to this instance.  This method should be
   * called on instances from the `options.forwardHostProp` callback
   * to propagate changes of host properties to each instance.
   *
   * Note this method enqueues the change, which are flushed as a batch.
   *
   * @param prop Property or path name
   * @param value Value of the property to forward
   */
  forwardHostProp(prop: string, value: any): void;

  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   *
   * @param hide Set to true to hide the children;
   * set to false to show them.
   */
  _showHideChildren(hide: boolean): void;

  /**
   * Stub of HTMLElement's `dispatchEvent`, so that effects that may
   * dispatch events safely no-op.
   *
   * @param event Event to dispatch
   */
  dispatchEvent(event: Event|null): any;
}

declare namespace templateInfo {

  class templatizeTemplateClass {
  }
}

declare namespace Polymer {

  namespace Templatize {


    /**
     * Returns an anonymous `Polymer.PropertyEffects` class bound to the
     * `<template>` provided.  Instancing the class will result in the
     * template being stamped into a document fragment stored as the instance's
     * `root` property, after which it can be appended to the DOM.
     *
     * Templates may utilize all Polymer data-binding features as well as
     * declarative event listeners.  Event listeners and inline computing
     * functions in the template will be called on the host of the template.
     *
     * The constructor returned takes a single argument dictionary of initial
     * property values to propagate into template bindings.  Additionally
     * host properties can be forwarded in, and instance properties can be
     * notified out by providing optional callbacks in the `options` dictionary.
     *
     * Valid configuration in `options` are as follows:
     *
     * - `forwardHostProp(property, value)`: Called when a property referenced
     *   in the template changed on the template's host. As this library does
     *   not retain references to templates instanced by the user, it is the
     *   templatize owner's responsibility to forward host property changes into
     *   user-stamped instances.  The `instance.forwardHostProp(property, value)`
     *    method on the generated class should be called to forward host
     *   properties into the template to prevent unnecessary property-changed
     *   notifications. Any properties referenced in the template that are not
     *   defined in `instanceProps` will be notified up to the template's host
     *   automatically.
     * - `instanceProps`: Dictionary of property names that will be added
     *   to the instance by the templatize owner.  These properties shadow any
     *   host properties, and changes within the template to these properties
     *   will result in `notifyInstanceProp` being called.
     * - `mutableData`: When `true`, the generated class will skip strict
     *   dirty-checking for objects and arrays (always consider them to be
     *   "dirty").
     * - `notifyInstanceProp(instance, property, value)`: Called when
     *   an instance property changes.  Users may choose to call `notifyPath`
     *   on e.g. the owner to notify the change.
     * - `parentModel`: When `true`, events handled by declarative event listeners
     *   (`on-event="handler"`) will be decorated with a `model` property pointing
     *   to the template instance that stamped it.  It will also be returned
     *   from `instance.parentModel` in cases where template instance nesting
     *   causes an inner model to shadow an outer model.
     *
     * When `options.forwardHostProp` is declared as an option, any properties
     * referenced in the template will be automatically forwarded from the host of
     * the `<template>` to instances, with the exception of any properties listed in
     * the `options.instanceProps` object.  `instanceProps` are assumed to be
     * managed by the owner of the instances, either passed into the constructor
     * or set after the fact.  Note, any properties passed into the constructor will
     * always be set to the instance (regardless of whether they would normally
     * be forwarded from the host).
     *
     * Note that the class returned from `templatize` is generated only once
     * for a given `<template>` using `options` from the first call for that
     * template, and the cached class is returned for all subsequent calls to
     * `templatize` for that template.  As such, `options` callbacks should not
     * close over owner-specific properties since only the first `options` is
     * used; rather, callbacks are called bound to the `owner`, and so context
     * needed from the callbacks (such as references to `instances` stamped)
     * should be stored on the `owner` such that they can be retrieved via `this`.
     *
     * @returns Generated class bound to the template
     *   provided
     */
    function templatize(template: HTMLTemplateElement, owner?: Polymer.PropertyEffects|null, options?: object|null): {new(): TemplateInstanceBase};


    /**
     * Returns the template "model" associated with a given element, which
     * serves as the binding scope for the template instance the element is
     * contained in. A template model is an instance of
     * `TemplateInstanceBase`, and should be used to manipulate data
     * associated with this template instance.
     *
     * Example:
     *
     *   let model = modelForElement(el);
     *   if (model.index < 10) {
     *     model.set('item.checked', true);
     *   }
     *
     * @returns Template instance representing the
     *   binding scope for the element
     */
    function modelForElement(template: HTMLTemplateElement|null, node?: Node|null): TemplateInstanceBase|null;
  }
}
