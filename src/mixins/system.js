export default {
  filters: {
    avatar(value) {
      if (!value) return '';
      const str = value.toString().substring(0, 2);
      return str.toUpperCase();
    },
  },
};
