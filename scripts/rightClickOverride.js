import { rightClickAction } from './rightClickOverride.js';

// rightClickOverride.js

class RightClickAction {
    constructor({ options, padding = '10px', bgColor = '#222', color = '#fff' }) {
        this.options = options;
        this.padding = padding;
        this.bgColor = bgColor;
        this.color = color;
        this.menu = null;
        this._init();
    }

    _init() {
        document.addEventListener('contextmenu', this._showMenu.bind(this));
        document.addEventListener('click', this._hideMenu.bind(this));
        window.addEventListener('resize', this._hideMenu.bind(this));
    }

    _showMenu(e) {
        e.preventDefault();
        this._hideMenu();

        this.menu = document.createElement('div');
        this.menu.style.position = 'fixed';
        this.menu.style.top = `${e.clientY}px`;
        this.menu.style.left = `${e.clientX}px`;
        this.menu.style.background = this.bgColor;
        this.menu.style.color = this.color;
        this.menu.style.padding = this.padding;
        this.menu.style.borderRadius = '6px';
        this.menu.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        this.menu.style.zIndex = 9999;
        this.menu.style.minWidth = '160px';
        this.menu.style.fontFamily = 'sans-serif';

        this.options.forEach(opt => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.cursor = 'pointer';
            item.style.padding = '8px 12px';
            item.style.borderRadius = '4px';
            item.style.transition = 'background 0.2s';
            item.onmouseenter = () => item.style.background = 'rgba(255,255,255,0.08)';
            item.onmouseleave = () => item.style.background = 'none';

            if (opt.icon) {
                const icon = document.createElement('span');
                icon.innerHTML = opt.icon; // SVG or emoji
                icon.style.marginRight = '8px';
                icon.style.display = 'inline-flex';
                item.appendChild(icon);
            }

            const label = document.createElement('span');
            label.textContent = opt.label;
            item.appendChild(label);

            item.onclick = (ev) => {
                ev.stopPropagation();
                this._hideMenu();
                if (typeof opt.onClick === 'function') opt.onClick(ev);
            };

            this.menu.appendChild(item);
        });

        document.body.appendChild(this.menu);

        // Prevent menu from going off-screen
        const rect = this.menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.menu.style.left = `${window.innerWidth - rect.width - 10}px`;
        }
        if (rect.bottom > window.innerHeight) {
            this.menu.style.top = `${window.innerHeight - rect.height - 10}px`;
        }
    }

    _hideMenu() {
        if (this.menu) {
            this.menu.remove();
            this.menu = null;
        }
    }
}

// Export as a function for easy use
export function rightClickAction(config) {
    return new RightClickAction(config);
}

/*
Example usage:


rightClickAction({
    options: [
        {
            label: 'Copy',
            icon: '📋',
            onClick: () => alert('Copy clicked!')
        },
        {
            label: 'Paste',
            icon: '📄',
            onClick: () => alert('Paste clicked!')
        },
        {
            label: 'Delete',
            icon: '<svg width="16" height="16" fill="red"><rect width="16" height="16"/></svg>',
            onClick: () => alert('Delete clicked!')
        }
    ],
    padding: '12px',
    bgColor: '#333',
    color: '#fff'
});
*/