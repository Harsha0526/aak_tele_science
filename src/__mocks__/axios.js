// src/__mocks__/axios.js
const mockAxios = jest.genMockFromModule('axios');

mockAxios.create = jest.fn(() => mockAxios);
mockAxios.defaults = {};

mockAxios.get = jest.fn(() => Promise.resolve({ data: {} }));
mockAxios.post = jest.fn(() => Promise.resolve({ status: 200 }));

export default mockAxios;
