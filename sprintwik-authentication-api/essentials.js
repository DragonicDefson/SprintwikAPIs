module.exports = {
  format : (data) => {
    let formatted_data = data
    if (data < 10) { formatted_data = '0' + data }
    return formatted_data
  }
}
