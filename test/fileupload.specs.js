import { mount } from '@vue/test-utils';
// import type { describe,it } from 'node:test';
import FileUpload from '../src/components/FileUpload.vue';
describe('FileUpload', () => {
    // Test that the component renders without errors.
    it('renders without errors', () => {
      const wrapper = mount(FileUpload);
      expect(wrapper.exists()).toBe(true);
    });
    
        // Test that the component contains an upload button.
    
    it('contains an upload button', () => {
      const wrapper = mount(FileUpload);
      const button = wrapper.find('.el-button');
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('选择视频/音频文件');
    });
    
        // Test that the beforeFileUpload method is called when a file is selected.
    
    it('calls beforeFileUpload when a file is selected', () => {
      const beforeFileUpload = jest.fn();
      const wrapper = mount(FileUpload, {
        global: {
          mocks: {
            beforeFileUpload
          }
        }
      });
      const upload = wrapper.findComponent({ name: 'ElUpload' });
      upload.vm.$emit('change', { file: { name: 'test.mp4', type: 'video/mp4' } });
      expect(beforeFileUpload).toHaveBeenCalled();
    });
    
        // Test that the afterFileUpload method is called after a file is uploaded.
    
    it('calls afterFileUpload after a file is uploaded', async () => {
      const afterFileUpload = jest.fn();
      const wrapper = mount(FileUpload, {
        global: {
          mocks: {
            afterFileUpload
          }
        }
      });
      const upload = wrapper.findComponent({ name: 'ElUpload' });
      await upload.vm.$emit('success', { response: { url: 'https://example.com/test.mp4' } });
      expect(afterFileUpload).toHaveBeenCalled();
      expect(wrapper.emitted().fileUpload[0][0]).toBe('https://example.com/test.mp4');
    });
    
        // Test that the accept property is set correctly on the ElUpload component.
    
    it('sets the accept property correctly', () => {
      const wrapper = mount(FileUpload);
      const upload = wrapper.findComponent({ name: 'ElUpload' });
      expect(upload.props('accept')).toBe('video/mp4, audio/mp3');
    });
});