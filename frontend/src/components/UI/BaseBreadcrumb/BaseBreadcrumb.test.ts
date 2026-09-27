import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { IonBreadcrumb } from '@ionic/vue';
import BaseBreadcrumb from './BaseBreadcrumb.vue';

describe('BaseBreadcrumb.vue', () => {
  it('renders breadcrumbs correctly', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Menu', href: '/menu' }
    ];
    const wrapper = mount(BaseBreadcrumb, {
      props: { items },
      global: {
        stubs: {
          IonBreadcrumbs: true,
          IonBreadcrumb: true
        }
      }
    });

    const breadcrumbs = wrapper.findAllComponents(IonBreadcrumb);
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].text()).toContain('Home');
    expect(breadcrumbs[0].attributes('href')).toBe('/');
    expect(breadcrumbs[1].text()).toContain('Menu');
    expect(breadcrumbs[1].attributes('href')).toBe('/menu');
  });
});
