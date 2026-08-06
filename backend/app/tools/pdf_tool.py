from langchain_core.tools import StructuredTool

from app.tools.pdf_tool_service import generate_pdf


GeneratePDFTool = StructuredTool.from_function(
    func=generate_pdf,
    name="generate_pdf",
    description=(
        "Generate a PDF report for a meeting."
    ),
)