import { sanitizeUrl } from "@braintree/sanitize-url";
import DOMPurify from "dompurify";

// 註冊至全域來防止安全性漏洞
//
export default {
  install(app) {
    // ==========================================
    // 1. DOMPurify: Custom Directive & Globals
    // ==========================================

    // Creates a secure alternative to Vue's native v-html
    // Usage in template: <div v-safe-html="userProvidedData"></div>
    app.directive("safe-html", {
      mounted(el, binding) {
        el.innerHTML = DOMPurify.sanitize(binding.value);
      },
      updated(el, binding) {
        el.innerHTML = DOMPurify.sanitize(binding.value);
      },
    });

    // Make sanitizers available programmatically in all components
    // Usage: this.$sanitize(htmlString) or this.$sanitizeUrl(url)
    app.config.globalProperties.$sanitize = DOMPurify.sanitize;
    app.config.globalProperties.$sanitizeUrl = sanitizeUrl;

    // ==========================================
    // 2. MutationObserver: Global Attribute Net
    // ==========================================

    const dangerousAttributes = [
      "onload",
      "onerror",
      "onmouseover",
      "onclick",
      "onfocus",
      "onunload",
    ];

    const sanitizeElement = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      // 1. Sanitize the 'src' attribute using sanitize-url
      if (node.hasAttribute("src")) {
        const rawSrc = node.getAttribute("src");
        const safeSrc = sanitizeUrl(rawSrc);
        if (safeSrc !== rawSrc) {
          node.setAttribute("src", safeSrc);
        }
      }

      // 2. Strip dangerous inline event handlers
      dangerousAttributes.forEach((attr) => {
        if (node.hasAttribute(attr)) {
          node.removeAttribute(attr);
        }
      });
    };

    // 3. Set up a MutationObserver for automatic page-wide registration
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              sanitizeElement(node);
              node.querySelectorAll?.("*").forEach(sanitizeElement);
            }
          });
        } else if (mutation.type === "attributes") {
          sanitizeElement(mutation.target);
        }
      });
    });

    // Observe the entire document root for dynamically added tags/attributes
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", ...dangerousAttributes],
      });
    }
  },
};
