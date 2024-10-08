import { createPopper, placements } from '@popperjs/core';
import { v4 as uuidv4 } from 'uuid';

interface TooltipElement extends HTMLElement {
    uuid: string;
    tooltip_value: string;
    popper: any;
}

export default {
    mounted(el: TooltipElement, binding: any) {
        let placement = 'bottom';
        if (placements.includes(binding.arg)) {
            placement = binding.arg;
        } else if (binding.arg) {
            console.error(`'${binding.arg}' is not a valid placement for a tooltip. It can be ${placements.join(', ')}.`);
        } else {
            // @ts-ignore
            let matches = Object.keys(binding.modifiers).filter(v => placements.includes(v));
            if (matches.length == 1) {
                placement = matches[0];
            }
        }
        
        let uuid = uuidv4();

        el.uuid = uuid;
        if (binding.value !== null && binding.value !== undefined) {
            el.tooltip_value = binding.value;
        }

        let popper: any;
        let tooltip: HTMLElement;

        // Register event listener
        el.addEventListener('mouseenter', () => {
            if (!popper && el.tooltip_value) {
                // Create tooltip
                tooltip = document.createElement('div');
                tooltip.setAttribute('id', uuid);
                tooltip.classList.add('tooltip');
                tooltip.classList.add('pointer-events-none');
                tooltip.classList.add('opacity-0');
                setTimeout(() => {
                    // There is a really low chance that the tooltip is already destroyed
                    if (tooltip) {
                        tooltip.classList.remove('opacity-0');
                        tooltip.classList.add('opacity-100');
                    }
                }, 1);
                

                // Create tooltip content
                let content = document.createElement('div');
                content.setAttribute('class', 'tooltip-content');
                content.innerHTML = el.tooltip_value;
                tooltip.appendChild(content);

                document.getElementById('tooltips')?.appendChild(tooltip);

                popper = createPopper(el, tooltip, {
                    // @ts-ignore
                    placement: placement,
                    strategy: 'fixed',
                });

                el.popper = popper;
            }
        });
        el.addEventListener('mouseleave', () => {
            if (binding.modifiers.show) {
                return;
            }
            if (popper) {
                popper.destroy();
                tooltip?.parentNode?.removeChild(tooltip);
                tooltip.remove();

                popper = null;
            }
        });

        if (binding.modifiers.show) {
            el.dispatchEvent(new Event('mouseenter'));
        }
    },
    updated(el: TooltipElement, binding: any) {
        if (binding.value !== binding.oldValue && el.uuid && binding.value !== null && binding.value !== undefined) {
            if (document.getElementById(el.uuid) && document.getElementById(el.uuid)?.children[0]) {
                // @ts-ignore
                document.getElementById(el.uuid).children[0].innerHTML = binding.value;
            }
            el.tooltip_value = binding.value;
        }
    },
    unmounted(el: TooltipElement) {
        if (el.popper) {
            el.popper.destroy();
        }
        if (el.uuid) {
            let tooltipEl = document.getElementById(el.uuid);
            if (tooltipEl && tooltipEl.parentElement) {
                tooltipEl.parentElement.removeChild(tooltipEl);
            }
        }
        el.replaceWith(el.cloneNode(true)); // Instead of removing all event listeners, we simply replace the element with its own clone
    }
};