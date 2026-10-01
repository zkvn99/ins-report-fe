export function validateNewPassword(password, passwordConfirm) {
  if (!password) return '새 비밀번호를 입력해주세요.'
  if (password.length < 8 || password.length > 72) return '비밀번호는 8자 이상 72자 이하여야 합니다.'
  if (password !== passwordConfirm) return '비밀번호 확인이 일치하지 않습니다.'
  return ''
}
